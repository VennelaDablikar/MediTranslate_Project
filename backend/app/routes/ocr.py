from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, List
import logging
import os
from ..utils.vision_ocr import process_prescription_image

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/extract")
async def extract_text(file: UploadFile = File(...), language: str = Form("English")) -> Dict:
    """
    Extract text and entities from prescription image using Google Vision API.
    
    Returns:
    - raw_ocr_text: Full OCR text from image
    - tokens: All tokens with per-token OCR confidence
    - drug_candidates: Fuzzy-matched drug names from lexicon
    - dosages: Extracted dosage values (mg, etc.)
    - dosage_forms: Extracted forms (tablet, capsule, etc.)
    - frequencies: Extracted frequency patterns (once daily, etc.)
    - confidence_metrics: OCR confidence statistics
    """
    try:
        # Log current env var state for debugging
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        logger.info(f"[DEBUG OCR] GOOGLE_APPLICATION_CREDENTIALS={creds_path}")
        
        # Read uploaded file
        image_bytes = await file.read()
        
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        # Check for preferred OCR engine
        ocr_engine = os.getenv("OCR_ENGINE", "gemini").lower() # Default to gemini if not set

        if ocr_engine == "gemini":
            try:
                from ..services.gemini_extractor import GeminiExtractor
                extractor = GeminiExtractor()
                # Check if API key is present before attempting
                if extractor.api_key:
                    logger.info(f"Using Gemini Flash Latest for extraction (Mime: {file.content_type}, Language: {language})")
                    result = await extractor.extract_prescription_data(image_bytes, mime_type=file.content_type, language=language)
                    return result
                else:
                    # Explicitly warn if API key is missing when Gemini is expected
                    logger.warning("Gemini API key not found. Please set GOOGLE_API_KEY in .env.")
                    raise HTTPException(status_code=500, detail="Gemini API Key not found. Please set GOOGLE_API_KEY.")
            except Exception as e:
                logger.error(f"Gemini extraction failed: {e}")
                # Raise the actual Gemini error so the user knows why it failed
                raise HTTPException(status_code=500, detail=f"Gemini Extraction Failed: {str(e)}")

        elif ocr_engine in ["tesseract", "hybrid", "pytesseract"]:
             try:
                # 1. Extract raw text using Tesseract
                logger.info("Using Hybrid Pipeline: Tesseract OCR -> Gemini NLP")
                # process_prescription_image handles the OCR preference
                # We need to temporarily set env var or modify call if we want to force it, 
                # but we modified vision_ocr.py to respect "PREFERRED_OCR" env var if passed? 
                # Actually, process_prescription_image reads os.getenv("PREFERRED_OCR").
                # Let's set it here for this request context if possible, or assume user set it globally.
                # BETTER: We can just manually call the underlying functions or trust the environment.
                # BUT, since we are in code, let's just use os.environ context for safety or update process_prescription_image to accept an arg.
                # Updating process_prescription_image signature is riskier. Let's set env var temporarily.
                os.environ["PREFERRED_OCR"] = "pytesseract"
                
                ocr_result = process_prescription_image(image_bytes)
                raw_text = ocr_result.get("raw_ocr_text", "")
                
                if not raw_text:
                     raise ValueError("Tesseract failed to extract any text.")

                # 2. Pass text to Gemini for structured extraction
                from ..services.gemini_extractor import GeminiExtractor
                extractor = GeminiExtractor()
                if extractor.api_key:
                     result = await extractor.extract_from_text(raw_text, language=language)
                     return result
                else:
                     logger.warning("Gemini API key missing for hybrid mode. Returning raw Tesseract text only.")
                     # Fallback: return raw OCR structure if Gemini is missing
                     return ocr_result

             except Exception as e:
                logger.error(f"Hybrid extraction failed: {e}")
                raise HTTPException(status_code=500, detail=f"Hybrid Extraction Failed: {str(e)}")
        
        # If we reach here, it means OCR_ENGINE was not gemini or hybrid
        # default fall through to legacy behavior or error
        raise HTTPException(status_code=400, detail="OCR_ENGINE must be set to 'gemini' or 'tesseract'.")
        
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text from image: {str(e)}")
