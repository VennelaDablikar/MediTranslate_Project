from fastapi import APIRouter
from typing import Dict, List

router = APIRouter()

@router.post("/extract")
async def extract_entities(data: Dict) -> Dict:
    """Extract named entities (medical terms) from text."""
    text = data.get("text", "")
    
    words = text.split()
    entities = []
    
    # Medical term mappings
    medical_terms = {
        "fever": "Symptom", "headache": "Symptom", "cough": "Symptom", "pain": "Symptom",
        "paracetamol": "Drug", "aspirin": "Drug", "ibuprofen": "Drug", "amoxicillin": "Drug",
        "tablet": "Form", "capsule": "Form", "injection": "Form",
        "orally": "Route", "intravenous": "Route",
        "mg": "Dosage", "ml": "Dosage", "gm": "Dosage",
        "twice": "Frequency", "thrice": "Frequency", "daily": "Frequency"
    }
    
    for word in words:
        word_lower = word.lower().rstrip('.,;:')
        if word_lower in medical_terms:
            entities.append({"text": word, "type": medical_terms[word_lower]})
    
    return {"entities": entities}
