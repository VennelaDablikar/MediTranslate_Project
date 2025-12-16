from fastapi import APIRouter
from ..services.dosage_extractor import extract_dosages

router = APIRouter()

@router.post("/extract")
def detect_dosage(data: dict):
    text = data["text"]
    doses = extract_dosages(text)
    
    # Extract dosage info from actual text
    import re
    dosage_info = []
    
    # Look for dose patterns like "500mg", "2 tablets"
    dose_pattern = r'(\d+)\s*(mg|ml|g|tablets?|capsules?)'
    matches = re.finditer(dose_pattern, text, re.IGNORECASE)
    for match in matches:
        dosage_info.append(f"{match.group(0)}")
    
    # Look for frequency patterns
    freq_patterns = {
        "twice daily": "BD (Twice daily)",
        "thrice daily": "TD (Thrice daily)",
        "once daily": "OD (Once daily)",
        "every 4-6 hours": "Every 4-6 hours",
        "every 8 hours": "Every 8 hours",
        "every 12 hours": "Every 12 hours"
    }
    
    text_lower = text.lower()
    for pattern, label in freq_patterns.items():
        if pattern in text_lower:
            dosage_info.append(label)
            break
    
    # Add extracted patterns from service
    if doses:
        dosage_info.extend(doses)
    
    return {"dosages": dosage_info}
