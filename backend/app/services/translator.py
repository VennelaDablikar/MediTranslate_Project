
from deep_translator import GoogleTranslator

def translate_text(text, target_lang='te'):
    """
    Translates text to the target language using deep-translator (Google Translate).
    Default target is Telugu ('te').
    """
    try:
        if not text:
            return ""
        translator = GoogleTranslator(source='auto', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Translation failed: {e}")
        return text 
