"""
Google Vision OCR utility for medical prescription processing.
Handles image preprocessing, Vision API calls, token extraction, and drug lexicon matching.
"""

import io
import re
import tempfile
import os
from typing import Dict, List, Optional, Tuple
from pathlib import Path

# TrOCR (Hugging Face) optional local OCR fallback
from google.cloud import vision
from PIL import Image
try:
    from transformers import TrOCRProcessor, VisionEncoderDecoderModel
    TROCR_AVAILABLE = True
except Exception:
    TROCR_AVAILABLE = False

# Lazy-loaded TrOCR objects
_TROCR_PROCESSOR = None
_TROCR_MODEL = None

def _load_trocr():
    global _TROCR_PROCESSOR, _TROCR_MODEL
    if _TROCR_PROCESSOR is None or _TROCR_MODEL is None:
        # prefer handwritten TrOCR for prescriptions / handwriting
        _TROCR_PROCESSOR = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
        _TROCR_MODEL = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
    return _TROCR_PROCESSOR, _TROCR_MODEL

def run_trocr_local(image_bytes: bytes) -> Tuple[str, Dict]:
    """Run TrOCR locally on image bytes. Returns (raw_text, meta).

    Requires `transformers` and `torch` installed. This is a synchronous call
    and may download model weights on first run (~200MB).
    """
    if not TROCR_AVAILABLE:
        raise Exception("TrOCR not available (install transformers and torch)")

    processor, model = _load_trocr()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    pixel_values = processor(images=img, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_text, {"engine": "trocr", "success": True}
import cv2
import numpy as np
from fuzzywuzzy import fuzz, process
import requests

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False

try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except ImportError as e:
    print(f"DEBUG: pytesseract import failed: {e}")
    PYTESSERACT_AVAILABLE = False


# ============================================================================
# DRUG LEXICON (Indian market - common generic and brand names)
# ============================================================================
import json

# ============================================================================
# DRUG LEXICON (Loaded from external JSON)
# ============================================================================
def load_common_drugs():
    """Load drug lexicon from medicines.json"""
    try:
        json_path = Path(__file__).parent.parent / "data" / "medicines.json"
        with open(json_path, "r") as f:
            drugs = json.load(f)
            # Normalize for matching
            return [d.lower() for d in drugs]
    except Exception as e:
        print(f"[WARNING] Failed to load medicines.json: {e}. Using fallback list.")
        return [
            "paracetamol", "acetaminophen", "ibuprofen", "aspirin", "amoxicillin", 
            "metformin", "atorvastatin", "amlodipine", "azithromycin", "ciprofloxacin"
        ]

COMMON_DRUGS = load_common_drugs()

# Dosage units
DOSAGE_UNITS = [
    r'\bmg\b', r'\bg\b', r'\bml\b', r'\bl\b', r'\bmcg\b', r'\bµg\b',
    r'\biu\b', r'\bunits\b', r'\btablet\b', r'\btablets\b', r'\bcapsule\b',
    r'\bcapsules\b', r'\bpuff\b', r'\bpuffs\b', r'\bdrop\b', r'\bdrops\b',
]

# Frequency patterns
FREQUENCY_PATTERNS = {
    'once daily': [r'\bod\b', r'\bonce\s+daily\b', r'\b1x\b'],
    'twice daily': [r'\bbd\b', r'\btwice\s+daily\b', r'\b2x\b', r'\bdouble\b'],
    'thrice daily': [r'\btd\b', r'\bthrice\s+daily\b', r'\b3x\b', r'\btds\b'],
    'four times daily': [r'\bqid\b', r'\b4x\b', r'\bfour\s+times\b'],
    'every 4-6 hours': [r'\bq\s*[46]\s*h\b', r'\bevery\s+[46]\s*hours\b'],
    'bedtime': [r'\bhs\b', r'\bbedtime\b', r'\bnightly\b'],
    'as needed': [r'\bprn\b', r'\bas\s+needed\b'],
}


# ============================================================================
# IMAGE PREPROCESSING
# ============================================================================
def preprocess_image(image_bytes: bytes, output_path: Optional[str] = None) -> str:
    """
    Preprocess image for OCR: denoise, increase contrast, adaptive threshold.
    Returns path to preprocessed image.
    """
    # Read image from bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Failed to decode image")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Denoise (median blur)
    gray = cv2.medianBlur(gray, 5)
    
    # Increase contrast (CLAHE - Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    
    # Adaptive threshold for better OCR of handwriting
    # Using smaller kernel for finer details
    binary = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=5
    )
    
    # Optional: Remove very small noise blobs (morphological operation)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # Save to temp file if not specified
    if output_path is None:
        fd, output_path = tempfile.mkstemp(suffix='.png')
        import os
        os.close(fd)
    
    cv2.imwrite(output_path, binary)
    return output_path


# ============================================================================
# GOOGLE VISION OCR
# ============================================================================
def run_google_vision_ocr(image_path: str) -> Tuple[str, Dict]:
    """
    Call Google Vision API with document_text_detection.
    Returns (raw_text, document_annotation_object).
    """
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    print(f"[DEBUG vision_ocr] GOOGLE_APPLICATION_CREDENTIALS env var: {creds_path}")
    
    client = vision.ImageAnnotatorClient()
    
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    
    # Use document_text_detection for better structure on documents
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(f"Vision API error: {response.error.message}")
    
    doc = response.full_text_annotation
    raw_text = doc.text
    
    return raw_text, doc


def run_ocr_space(image_bytes: bytes) -> Tuple[str, Dict]:
    """
    Call OCR.space API (free tier: 250 requests/day).
    Returns (raw_text, api_response_dict).
    """
    apikey = os.getenv("OCR_SPACE_API_KEY", "K87899142C")
    print(f"[DEBUG vision_ocr] Using OCR.space with API key: {apikey[:5]}...")
    
    url = "https://api.ocr.space/parse/image"
    files = {"file": ("image.png", image_bytes)}
    data = {
        "apikey": apikey,
        "language": "eng",
        "isOverlayRequired": False,
    }
    
    try:
        r = requests.post(url, files=files, data=data, timeout=60)
        r.raise_for_status()
    except Exception as e:
        raise Exception(f"OCR.space request failed: {e}")
    
    j = r.json()
    
    if j.get("IsErroredOnProcessing"):
        error_msg = j.get("ErrorMessage", "Unknown OCR.space error")
        raise Exception(f"OCR.space error: {error_msg}")
    
    if not j.get("ParsedResults") or len(j["ParsedResults"]) == 0:
        raise Exception("OCR.space returned no results")
    
    raw_text = j["ParsedResults"][0].get("ParsedText", "")
    print(f"[DEBUG vision_ocr] OCR.space extracted {len(raw_text)} characters")
    
    return raw_text, j


def run_easyocr(image_bytes: bytes) -> Tuple[str, Dict]:
    """
    Local EasyOCR (no external dependencies required).
    Returns (raw_text, result_dict).
    """
    if not EASYOCR_AVAILABLE:
        raise Exception("easyocr not installed. Install with: pip install easyocr")
    
    print(f"[DEBUG vision_ocr] Using local EasyOCR...")
    
    # Save bytes to temp file
    fd, temp_path = tempfile.mkstemp(suffix=".png")
    try:
        os.write(fd, image_bytes)
        os.close(fd)
        
        # Initialize reader (downloads model on first use)
        reader = easyocr.Reader(['en'], gpu=False)
        
        # Run OCR
        results = reader.readtext(temp_path)
        raw_text = "\n".join([text for (_, text, _) in results])
        
        print(f"[DEBUG vision_ocr] EasyOCR extracted {len(raw_text)} characters")
        
        return raw_text, {"engine": "easyocr", "success": True, "detections": len(results)}
    finally:
        try:
            os.remove(temp_path)
        except:
            pass


def run_pytesseract_local(image_bytes: bytes) -> Tuple[str, Dict]:
    """
    Local Tesseract OCR via pytesseract (fallback).
    Returns (raw_text, empty_dict_as_placeholder).
    """
    if not PYTESSERACT_AVAILABLE:
        raise Exception("pytesseract not installed. Install with: pip install pytesseract")
    
    print(f"[DEBUG vision_ocr] Using local pytesseract...")
    
    fd, temp_path = tempfile.mkstemp(suffix=".png")
    try:
        os.write(fd, image_bytes)
        os.close(fd)
        
        raw_text = pytesseract.image_to_string(temp_path, lang="eng")
        print(f"[DEBUG vision_ocr] pytesseract extracted {len(raw_text)} characters")
        
        return raw_text, {"engine": "pytesseract", "success": True}
    finally:
        try:
            os.remove(temp_path)
        except:
            pass


def extract_tokens_with_confidence(doc) -> List[Dict]:
    """
    Extract tokens from Vision API response with per-token confidence.
    """
    tokens = []
    for page in doc.pages:
        for block in page.blocks:
            for par in block.paragraphs:
                for word in par.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    # Average confidence across symbols in the word
                    confs = [s.confidence for s in word.symbols if s.confidence is not None]
                    avg_conf = sum(confs) / len(confs) if confs else 0.5
                    
                    tokens.append({
                        'text': word_text,
                        'confidence': avg_conf,
                    })
    
    return tokens


def normalize_ocr_text(text: str) -> str:
    """Simple post-processing to normalize OCR output for better matching.

    - Fix common character confusions (O/0, l/1, S/5)
    - Normalize whitespace and remove excessive punctuation
    - Lowercase for normalization
    """
    if not text:
        return text
    s = text
    # Common OCR confusions mapping
    replacements = {
        '\\bO\\b': '0',  # single O -> 0
    }
    # Replace some typical character confusions within words
    s = s.replace('\u2013', '-')
    s = s.replace('\u2014', '-')
    s = s.replace('—', '-')
    # Normalize common visual confusions within tokens
    s = s.replace('lmg', 'mg')
    s = s.replace('l0', '10')
    s = s.replace('Omg', '0mg')
    s = s.replace('O', 'O')
    # Replace letter-like digits heuristics
    s = re.sub(r'(?<=\d)\s*[oO]\s*(?=\d)', '0', s)
    # Correct some frequent OCR errors: I/1, l/1 in units context
    s = re.sub(r'\bl\b', '1', s)
    # Normalize multipliers like 'x' variants to 'x'
    s = re.sub(r'[×xX]', 'x', s)
    # Remove excessive punctuation
    s = re.sub(r'[\u2026\,;:]+', ' ', s)
    # Collapse whitespace
    s = re.sub(r'\s+', ' ', s)
    s = s.strip()
    # Lowercase for matching against lexicon
    s = s.lower()
    return s


# ============================================================================
# DRUG LEXICON MATCHING
# ============================================================================
def match_drug_candidates(
    tokens: List[Dict],
    raw_text: str,
    min_score: int = 75,
    min_confidence: float = 0.4
) -> List[Dict]:
    """
    Fuzzy-match against `COMMON_DRUGS` using n-gram search on `raw_text` and token fallback.

    Strategy:
    - Generate n-grams (1..4 words) from `raw_text` (cleaned) and fuzzy-match each n-gram
    - Also try single-token matches from `tokens` as fallback
    - Return deduplicated list sorted by score (desc)
    """
        
    def clean_text(s: str) -> str:
        return re.sub(r"[^A-Za-z0-9\s]", " ", s).lower()

    text = clean_text(raw_text or "")
    words = [w for w in text.split() if w]
    candidates = []

    # n-gram search (1..4)
    max_n = 4
    for n in range(1, max_n + 1):
        for i in range(0, max(0, len(words) - n + 1)):
            ngram = " ".join(words[i:i+n])
            # skip too short
            if len(ngram) < 3:
                continue
            best = process.extractOne(ngram, COMMON_DRUGS, scorer=fuzz.token_sort_ratio)
            if best and best[1] >= min_score:
                candidates.append({'drug': best[0], 'score': best[1], 'match_text': ngram})

    # token-level fallback (if no candidates found yet or to boost confidence)
    token_texts = [t['text'] for t in tokens]
    for t in token_texts:
        cleaned = clean_text(t)
        if not cleaned.strip():
            continue
        best = process.extractOne(cleaned, COMMON_DRUGS, scorer=fuzz.token_sort_ratio)
        if best and best[1] >= min_score:
            candidates.append({'drug': best[0], 'score': best[1], 'match_text': t})

    # Deduplicate by drug name, keep highest score and include example context
    unique = {}
    for c in candidates:
        name = c['drug']
        if name not in unique or c['score'] > unique[name]['score']:
            unique[name] = c

    # Sort results by score descending
    results = sorted(unique.values(), key=lambda x: x['score'], reverse=True)
    return results


# ============================================================================
# DOSAGE & FREQUENCY EXTRACTION
# ============================================================================
def extract_dosages(text: str) -> List[str]:
    """
    Extract dosage patterns: {number}{unit}
    """
    pattern = r'\b(\d+(?:\.\d+)?)\s*(?:mg|g|ml|mcg|iu|tablets?|capsules?|puffs?|drops?)\b'
    matches = re.findall(pattern, text, flags=re.I)
    return matches


def find_dosage_matches(text: str) -> List[str]:
    """
    Find full dosage substrings in text, e.g. '500 mg', '1 tablet', '2-3 tablets'
    Returns list of matched substrings (raw appearance).
    """
    pattern = r"\b\d+(?:[-–—]\d+)?(?:\.\d+)?\s*(?:mg|g|ml|mcg|iu|tablets?|tablet|capsules?|capsule|puffs?|drops?|tabs?)\b"
    matches = re.findall(pattern, text, flags=re.I)
    # normalize whitespace
    return [m.strip() for m in matches]


def associate_dosages(drug_candidates: List[Dict], raw_text: str, window_chars: int = 80) -> List[Dict]:
    """
    For each drug candidate, search the raw_text near the match_text and extract dosage strings.
    Returns a list of dicts: {drug, score, match_text, dosages: [..]}
    """
    results = []
    if not raw_text:
        for c in drug_candidates:
            results.append({**c, 'dosages': []})
        return results

    text_lower = raw_text.lower()
    for c in drug_candidates:
        match_text = c.get('match_text', '') or ''
        dosages_found = set()

        # find all occurrences of the match_text in raw_text (case-insensitive)
        try:
            for m in re.finditer(re.escape(match_text.lower()), text_lower):
                start, end = m.start(), m.end()
                a = max(0, start - window_chars)
                b = min(len(text_lower), end + window_chars)
                window = raw_text[a:b]
                found = find_dosage_matches(window)
                for d in found:
                    dosages_found.add(d)
        except re.error:
            # If match_text contains regex-sensitive content, fallback to scanning whole text
            found = find_dosage_matches(raw_text)
            for d in found:
                dosages_found.add(d)

        # If no dosages found near match_text, try scanning whole text for likely dosage associated with drug name
        if not dosages_found:
            # naive approach: find any dosage that appears near the drug name words
            found = find_dosage_matches(raw_text)
            for d in found:
                dosages_found.add(d)

        results.append({
            'drug': c.get('drug'),
            'score': c.get('score'),
            'match_text': c.get('match_text'),
            'dosages': sorted(list(dosages_found))
        })

    return results


def extract_dosage_forms(text: str) -> List[str]:
    """
    Extract dosage forms: tablet, capsule, syrup, injection, etc.
    """
    forms = [
        'tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment',
        'lotion', 'gel', 'suspension', 'solution', 'powder',
    ]
    pattern = r'\b(' + '|'.join(forms) + r')\b'
    matches = re.findall(pattern, text, flags=re.I)
    return [m.lower() for m in matches]


def extract_frequencies(text: str) -> Dict[str, List[str]]:
    """
    Extract frequency patterns from text.
    """
    frequencies = {}
    for freq_name, patterns in FREQUENCY_PATTERNS.items():
        matched = []
        for p in patterns:
            matches = re.findall(p, text, flags=re.I)
            matched.extend(matches)
        if matched:
            frequencies[freq_name] = list(set(matched))
    
    return frequencies


def extract_patient_name(raw_text: str, tokens: List[Dict]) -> Optional[str]:
    """
    Heuristic extraction of patient name from OCR `raw_text` and token list.

    Strategies (ordered):
    - Look for labeled fields: 'Patient', 'Patient Name', 'Name', 'Kame', 'Pt', 'Patient:' etc.
    - If labels fail, inspect the top lines (first 6) for a line that looks like a personal name
      (2-3 words, alphabetic, capitalized-like).
    - Finally, fall back to scanning tokens for consecutive capitalized words.
    """
    if not raw_text:
        return None

    text = raw_text.replace('\r', '\n')
    # Try labeled patterns
    label_patterns = [r"patient\s*name\s*[:\-]\s*(?P<name>[A-Za-z][A-Za-z\s\.]{1,60})",
                      r"patient\s*[:\-]\s*(?P<name>[A-Za-z][A-Za-z\s\.]{1,60})",
                      r"name\s*[:\-]\s*(?P<name>[A-Za-z][A-Za-z\s\.]{1,60})",
                      r"kame\s*[:\-]\s*(?P<name>[A-Za-z][A-Za-z\s\.]{1,60})",
                      r"pt\.?\s*[:\-]\s*(?P<name>[A-Za-z][A-Za-z\s\.]{1,60})"]

    for pat in label_patterns:
        m = re.search(pat, raw_text, flags=re.I)
        if m:
            name = m.group('name').strip()
            # Clean common OCR artifacts
            name = re.sub(r"[^A-Za-z\s\.\-]", "", name).strip()
            if len(name) > 1:
                return name

    # Check top few lines for a plausible name (2-3 words, mostly alphabetic)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for l in lines[:6]:
        parts = [p for p in re.split(r"\s+", l) if p]
        if 2 <= len(parts) <= 4:
            alpha_ratio = sum(1 for p in parts if re.match(r"^[A-Za-z][A-Za-z\.\-]*$", p)) / len(parts)
            if alpha_ratio >= 0.6:
                candidate = " ".join(parts)
                candidate = re.sub(r"[^A-Za-z\s\.\-]", "", candidate).strip()
                if len(candidate) > 2:
                    return candidate

    # Token-based fallback: look for consecutive capitalized-like tokens
    token_texts = [t['text'] for t in tokens]
    for i in range(len(token_texts)-1):
        a = re.sub(r"[^A-Za-z]", "", token_texts[i])
        b = re.sub(r"[^A-Za-z]", "", token_texts[i+1])
        if a and b and a[0].isalpha() and b[0].isalpha() and a[0].isupper() and b[0].isupper():
            candidate = f"{a} {b}"
            return candidate

    return None


# ============================================================================
# MAIN PIPELINE
# ============================================================================
def process_prescription_image(image_bytes: bytes) -> Dict:
    """
    Full pipeline: preprocess -> OCR (with fallback) -> extract tokens -> fuzzy match -> extract entities.
    Fallback order: Google Vision -> OCR.space -> EasyOCR -> pytesseract.
    Returns structured prescription data.
    """
    preprocessed_path = preprocess_image(image_bytes)
    
    raw_text = None
    ocr_engine = None
    tokens = []
    doc = None
    
    # Determine preferred OCR engine: allow environment override
    preferred = os.getenv("PREFERRED_OCR", "").strip().lower()

    # Try engines in preferred order. Two common modes:
    # - preferred == 'trocr' : TrOCR -> Google Vision -> ...
    # - preferred == 'pytesseract': pytesseract -> Google Vision -> ...
    # - default (or 'google'): Google Vision -> ...
    trocr_error = None
    vision_error = None
    ocr_space_error = None
    easyocr_error = None
    pytesseract_error = None

    def try_tr0cr():
        nonlocal trocr_error
        if TROCR_AVAILABLE:
            try:
                print("[DEBUG] Attempting local TrOCR (HF)...")
                rtext, _ = run_trocr_local(image_bytes)
                print("[DEBUG] TrOCR succeeded")
                return rtext, "trocr", None
            except Exception as et:
                trocr_error = et
                print(f"[DEBUG] TrOCR failed: {et}")
        else:
            print("[DEBUG] TrOCR not available")
        return None, None, trocr_error

    def try_vision():
        nonlocal vision_error
        try:
            print("[DEBUG] Attempting Google Vision OCR...")
            rtext, doc = run_google_vision_ocr(preprocessed_path)
            print("[DEBUG] Google Vision succeeded")
            return rtext, "google_vision", doc
        except Exception as e:
            vision_error = e
            print(f"[DEBUG] Google Vision failed: {e}")
            return None, None, vision_error

    def try_ocr_space():
        nonlocal ocr_space_error
        try:
            print("[DEBUG] Attempting OCR.space...")
            rtext, meta = run_ocr_space(image_bytes)
            print("[DEBUG] OCR.space succeeded")
            return rtext, "ocr_space", meta
        except Exception as e:
            ocr_space_error = e
            print(f"[DEBUG] OCR.space failed: {e}")
            return None, None, ocr_space_error

    def try_easyocr():
        nonlocal easyocr_error
        try:
            print("[DEBUG] Attempting EasyOCR...")
            rtext, meta = run_easyocr(image_bytes)
            print("[DEBUG] EasyOCR succeeded")
            return rtext, "easyocr", meta
        except Exception as e:
            easyocr_error = e
            print(f"[DEBUG] EasyOCR failed: {e}")
            return None, None, easyocr_error

    def try_pytesseract():
        nonlocal pytesseract_error
        try:
            print("[DEBUG] Attempting local pytesseract...")
            rtext, meta = run_pytesseract_local(image_bytes)
            print("[DEBUG] pytesseract succeeded")
            return rtext, "pytesseract", meta
        except Exception as e:
            pytesseract_error = e
            print(f"[DEBUG] pytesseract failed: {e}")
            return None, None, pytesseract_error

    raw_text = None
    doc = None
    # prefer trocr first if requested
    if preferred == 'trocr':
        raw_text, ocr_engine, e = try_tr0cr()
        if raw_text is None: raw_text, ocr_engine, e = try_vision()
        if raw_text is None: raw_text, ocr_engine, e = try_ocr_space()
        if raw_text is None: raw_text, ocr_engine, e = try_easyocr()
        if raw_text is None: raw_text, ocr_engine, e = try_pytesseract()
    elif preferred == 'pytesseract':
        print("[DEBUG] Preferred OCR: pytesseract")
        raw_text, ocr_engine, e = try_pytesseract()
        if raw_text is None: raw_text, ocr_engine, e = try_vision()
        if raw_text is None: raw_text, ocr_engine, e = try_tr0cr()
        if raw_text is None: raw_text, ocr_engine, e = try_ocr_space()
        if raw_text is None: raw_text, ocr_engine, e = try_easyocr()
    else:
        # default: try google first
        raw_text, ocr_engine, doc = try_vision()
        if raw_text is None: raw_text, ocr_engine, e = try_tr0cr()
        if raw_text is None: raw_text, ocr_engine, e = try_pytesseract()  # Try pytesseract earlier in fallback
        if raw_text is None: raw_text, ocr_engine, e = try_ocr_space()
        if raw_text is None: raw_text, ocr_engine, e = try_easyocr()

    # If still None, aggregate and raise
    if not raw_text:
        raise Exception(f"All OCR engines failed. Vision: {vision_error} | TrOCR: {trocr_error} | OCR.space: {ocr_space_error} | EasyOCR: {easyocr_error} | pytesseract: {pytesseract_error}")
    
    # Post-process OCR text to normalize common OCR errors before tokenization
    raw_text = normalize_ocr_text(raw_text)

    # Extract tokens with confidence (only if using Vision which provides token-level confidence)
    if doc is not None:
        tokens = extract_tokens_with_confidence(doc)
    else:
        # For TrOCR/OCR.space/EasyOCR/pytesseract, create simple tokens from normalized raw text
        tokens = [{"text": word, "confidence": 0.5} for word in raw_text.split()]
    
    # Fuzzy match against drug lexicon
    drug_candidates = match_drug_candidates(tokens, raw_text, min_score=70, min_confidence=0.4)
    
    # Extract structured entities
    dosages = extract_dosages(raw_text)
    dosage_forms = extract_dosage_forms(raw_text)
    frequencies = extract_frequencies(raw_text)
    
    # Clean up temp file
    try:
        os.remove(preprocessed_path)
    except:
        pass
    
    # Extract patient name heuristically
    patient_name = extract_patient_name(raw_text, tokens)

    return {
        'raw_ocr_text': raw_text,
        'ocr_engine': ocr_engine,  # which engine was used
        'patient_name': patient_name,
        'tokens': tokens,  # all tokens with confidence
        'drug_candidates': drug_candidates,  # fuzzy-matched drugs
        'dosages': dosages,  # numeric dose values
        'dosage_forms': dosage_forms,  # tablet, capsule, etc.
        'frequencies': frequencies,  # once daily, twice daily, etc.
        'confidence_metrics': {
            'avg_token_confidence': sum(t['confidence'] for t in tokens) / len(tokens) if tokens else 0,
            'high_confidence_tokens': len([t for t in tokens if t['confidence'] >= 0.7]),
            'total_tokens': len(tokens),
        }
    }
