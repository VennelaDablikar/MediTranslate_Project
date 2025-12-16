from app.services.dosage_extractor import extract_dosages

def test_dosage_extraction():
    text = "Take medicine 1-0-1 for 5 days"
    doses = extract_dosages(text)
    assert "1-0-1" in doses
