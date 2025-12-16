import re

PATTERNS = [
    r"\b[0-1]-[0-1]-[0-1]\b",
    r"\bBD\b",  # twice daily
    r"\bOD\b",  # once daily
    r"\bHS\b",  # at night
    r"\bSOS\b"  # if required
]

def extract_dosages(text):
    matches = []
    for p in PATTERNS:
        matches.extend(re.findall(p, text, flags=re.IGNORECASE))
    return matches
