#!/usr/bin/env python3
"""
Test the OCR endpoint with a simple image.
"""
import requests
import json
from pathlib import Path

# Create a simple test image (1x1 pixel) for quick testing
from PIL import Image, ImageDraw, ImageFont
import io

# Create a test prescription image
img = Image.new('RGB', (400, 300), color='white')
draw = ImageDraw.Draw(img)

# Add sample prescription text
text_lines = [
    "Prescription",
    "Patient: John Doe",
    "Date: 2024-01-15",
    "",
    "Medications:",
    "1. Amoxicillin 500 mg tablets",
    "   Take 1 tablet three times daily",
    "",
    "2. Ibuprofen 400 mg tablets",
    "   Take 1 tablet twice daily with food",
    "",
    "3. Paracetamol 500 mg tablets",
    "   Take 1-2 tablets every 4-6 hours",
]

y = 10
for line in text_lines:
    draw.text((10, y), line, fill='black')
    y += 20

# Save image to bytes
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)

# Send to API
url = "http://127.0.0.1:8000/ocr/extract"
files = {"file": ("test_prescription.png", img_bytes, "image/png")}

print("Sending test image to /ocr/extract endpoint...")
try:
    response = requests.post(url, files=files, timeout=60)
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ OCR Result:")
        print(json.dumps(result, indent=2))
        
        # Extract key info
        print(f"\n🔍 OCR Engine Used: {result.get('ocr_engine', 'unknown')}")
        print(f"📄 Raw Text:\n{result.get('raw_ocr_text', '')[:200]}...")
        print(f"💊 Drugs Found: {[d['drug'] for d in result.get('drug_candidates', [])]}")
        print(f"📋 Dosages: {result.get('dosages', [])}")
        print(f"⏰ Frequencies: {result.get('frequencies', [])}")
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Request failed: {e}")
