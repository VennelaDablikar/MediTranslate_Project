from rapidfuzz import process

MEDICINES = [
    "Acemiz-CT", "OfloPod", "Pan-D", "Ascodil-D",
    "Coscavelt-LM", "Emfolt", "Montair-LC"
]

def correct_medicines(text):
    corrected = []
    for word in text.split():
        match, score, _ = process.extractOne(word, MEDICINES)
        corrected.append(match if score > 70 else word)
    return " ".join(corrected)
