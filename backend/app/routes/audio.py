from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from gtts import gTTS
import base64
import io

router = APIRouter()

class AudioRequest(BaseModel):
    text: str
    language: str = "en"

@router.post("/generate")
async def generate_audio(request: AudioRequest):
    """Generate audio from text using gTTS and return as base64."""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")

        # Map frontend language names to gTTS codes
        lang_map = {
            "English": "en",
            "Spanish": "es",
            "French": "fr",
            "Hindi": "hi",
            "Telugu": "te",
            "Tamil": "ta",
            "Kannada": "kn",
            "Malayalam": "ml",
            "Marathi": "mr",
            "Gujarati": "gu",
            "Bengali": "bn",
            "Punjabi": "pa",
            "Urdu": "ur"
        }
        
        # Use mapped code or default to provided language/en
        lang_code = lang_map.get(request.language, request.language) or "en"
        
        # Translate text if target language is not English
        # This ensures that even existing English records are read out in the target language
        final_text = request.text
        if request.language != "English" and request.language != "en":
            try:
                from ..services.gemini_extractor import GeminiExtractor
                extractor = GeminiExtractor()
                if extractor.api_key:
                    final_text = await extractor.translate_text(request.text, request.language)
            except Exception as tr_error:
                print(f"Translation for audio failed: {tr_error}")
                # Fallback to original text
                pass

        # Generate audio
        tts = gTTS(text=final_text, lang=lang_code)
        
        # Save to memory buffer
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        
        # Encode to base64
        audio_base64 = base64.b64encode(mp3_fp.read()).decode("utf-8")
        
        return {
            "audio_base64": audio_base64,
            "format": "mp3",
            "message": "Audio generated successfully"
        }
        
    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
