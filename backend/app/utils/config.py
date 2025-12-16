import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_VISION_KEY = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

AUDIO_DIR = "app/static/audio/"
LANGUAGE = os.getenv("DEFAULT_LANGUAGE", "en")
