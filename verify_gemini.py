
import os
import asyncio
from dotenv import load_dotenv
import sys

# Add backend to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.gemini_extractor import GeminiExtractor

# Creates a dummy white image for testing connectivity
from PIL import Image
import io

def create_dummy_image():
    img = Image.new('RGB', (100, 100), color = 'white')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

async def verify():
    load_dotenv(os.path.join(os.getcwd(), 'backend', '.env')) # Try to load from backend/.env
    load_dotenv() # And root .env

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY not found in environment variables.")
        print("Please add GOOGLE_API_KEY=your_key_here to your .env file.")
        return

    print(f"✅ GOOGLE_API_KEY found: {api_key[:5]}...{api_key[-3:]}")

    print("\nAttempting to initialize GeminiExtractor...")
    try:
        extractor = GeminiExtractor()
        print("✅ GeminiExtractor initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize extractor: {e}")
        return

    print("\nSending dummy image to Gemini for connectivity test...")
    try:
        dummy_bytes = create_dummy_image()
        # We expect it to return nulls but not fail
        result = await extractor.extract_prescription_data(dummy_bytes)
        print("✅ Gemini API call successful!")
        print("Response received:", result)
    except Exception as e:
        print(f"❌ Gemini API call failed: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
