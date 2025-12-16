from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, List
import logging
import os
from ..utils.vision_ocr import process_prescription_image

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/extract")
async def extract_text(file: UploadFile = File(...)) -> Dict:
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
                    logger.info(f"Using Gemini Flash Latest for extraction (Mime: {file.content_type})")
                    result = await extractor.extract_prescription_data(image_bytes, mime_type=file.content_type)
                    return result
                else:
                    # Explicitly warn if API key is missing when Gemini is expected
                    logger.warning("Gemini API key not found. Please set GOOGLE_API_KEY in .env.")
                    raise HTTPException(status_code=500, detail="Gemini API Key not found. Please set GOOGLE_API_KEY.")
            except Exception as e:
                logger.error(f"Gemini extraction failed: {e}")
                # Raise the actual Gemini error so the user knows why it failed
                raise HTTPException(status_code=500, detail=f"Gemini Extraction Failed: {str(e)}")
        
                # Raise the actual Gemini error so the user knows why it failed
                raise HTTPException(status_code=500, detail=f"Gemini Extraction Failed: {str(e)}")
        
        # If we reach here, it means OCR_ENGINE was not gemini, but we don't want Vision fallback.
        # Since user explicitly requested NO Vision API, we raise an error if Gemini wasn't used.
        raise HTTPException(status_code=400, detail="OCR_ENGINE must be set to 'gemini'. Google Vision is disabled.")
        
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text from image: {str(e)}")
