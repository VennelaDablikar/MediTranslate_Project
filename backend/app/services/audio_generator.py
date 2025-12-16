from gtts import gTTS
import uuid
import os

AUDIO_PATH = "app/static/audio/"

def generate_audio(text):
    filename = f"{uuid.uuid4()}.mp3"
    filepath = AUDIO_PATH + filename

    tts = gTTS(text=text, lang="en")
    tts.save(filepath)

    return f"/static/audio/{filename}"
