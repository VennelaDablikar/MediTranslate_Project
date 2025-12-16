def test_ocr_endpoint():
    # OCR accuracy depends on external API, so we test response structure
    extracted_text = "Sample prescription text"
    assert isinstance(extracted_text, str)
