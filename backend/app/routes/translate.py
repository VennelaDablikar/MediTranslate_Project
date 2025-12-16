
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.translator import translate_text

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = 'te' # Default to Telugu

@router.post("/content")
async def translate_content(request: TranslationRequest):
    """
    Translates the provided text into the target language.
    Note: Endpoint is /content relative to /translate prefix
    """
    try:
        translated_text = translate_text(request.text, request.target_lang)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
