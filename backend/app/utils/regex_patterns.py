DOSAGE_PATTERNS = [
    r"\b[0-1]-[0-1]-[0-1]\b",
    r"\bBD\b",
    r"\bOD\b",
    r"\bHS\b",
    r"\bSOS\b"
]

MEDICAL_ABBREVIATIONS = {
    r"\bT\.\b": "Tablet",
    r"\bCap\.\b": "Capsule",
    r"\bSyp\.\b": "Syrup",
    r"\bInj\.\b": "Injection"
}
