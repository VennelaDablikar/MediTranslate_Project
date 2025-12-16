from app.services.fuzzy_matching import correct_medicines

def test_fuzzy_matching():
    input_text = "Pan D"
    output = correct_medicines(input_text)
    assert "Pan-D" in output
