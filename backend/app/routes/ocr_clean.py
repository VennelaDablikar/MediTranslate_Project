"""
Clean OCR extraction endpoint: returns only patient_name and medicines (with dosages).
Filters out all unnecessary internal data.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, List
import logging
from ..utils.vision_ocr import process_prescription_image, associate_dosages

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/extract-clean")
async def extract_clean(file: UploadFile = File(...)) -> Dict:
    """
    Extract prescription data and return only:
    - patient_name (string or null)
    - medicines (list of {drug, dosages, score})
    
    All diagnostic/form data is filtered out.
    """
    try:
        # Read file
        contents = await file.read()
        
        # Run full pipeline
        result = process_prescription_image(contents)
        
        # Extract only medicines with dosages
        drug_candidates = result.get('drug_candidates', [])
        medicines = associate_dosages(drug_candidates, result.get('raw_ocr_text', ''))
        
        # Clean up medicines list: only keep drug, dosages, and score
        clean_medicines = [
            {
                'drug': m.get('drug'),
                'dosages': m.get('dosages', []),
                'score': m.get('score')
            }
            for m in medicines if m.get('drug')
        ]
        
        # Return only what matters
        return {
            'patient_name': result.get('patient_name'),
            'medicines': clean_medicines
        }
        
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to extract: {str(e)}")
