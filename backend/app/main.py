import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import ocr as ocr_routes
from .routes import ocr_clean as ocr_clean_routes
from .routes import nlp as nlp_routes
from .routes import translate as translate_routes
from .routes import audio as audio_routes
from .routes import dosage as dosage_routes

# Load environment variables from .env file
# Try loading from project root first
project_root = Path(__file__).parent.parent.parent
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path)

# Also try loading from backend root (where we just wrote it)
backend_root = Path(__file__).parent.parent
env_path_backend = backend_root / ".env"
load_dotenv(dotenv_path=env_path_backend, override=True)

# Set Google Cloud credentials from env variable
google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if google_creds:
    # Resolve relative path to absolute from project root
    if not os.path.isabs(google_creds):
        creds_path = project_root / google_creds
        google_creds = str(creds_path.resolve())
        print(f"[DEBUG] Setting GOOGLE_APPLICATION_CREDENTIALS to: {google_creds}")
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_creds

app = FastAPI(
    title="MediTranslate API",
    description="Medical prescription translation and explanation service",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to MediTranslate API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Include routers
app.include_router(ocr_routes.router, prefix="/ocr", tags=["OCR"])
app.include_router(ocr_clean_routes.router, prefix="/ocr", tags=["OCR"])
app.include_router(nlp_routes.router, prefix="/nlp", tags=["NLP"])
app.include_router(translate_routes.router, prefix="/translate", tags=["Translation"])
app.include_router(audio_routes.router, prefix="/audio", tags=["Audio"])
app.include_router(dosage_routes.router, prefix="/dosage", tags=["Dosage"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
