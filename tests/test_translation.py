
from app.services.translator import translate_text

if __name__ == "__main__":
    text = "fever"
    translated = translate_text(text, target_lang='te')
    print(f"Original: {text}")
    print(f"Translated: {translated}")
    assert translated != "" and translated != text
    print("Test Passed!")
