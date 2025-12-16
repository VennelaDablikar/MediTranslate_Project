
import os
import json
import logging
import google.generativeai as genai
from typing import Dict, Optional
from PIL import Image
import io

logger = logging.getLogger(__name__)

class GeminiExtractor:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            logger.warning("GOOGLE_API_KEY not found. Gemini extraction will fail.")
        else:
            genai.configure(api_key=self.api_key)
            print(f"[DEBUG] Configured Gemini with Key: ...{self.api_key[-5:] if self.api_key else 'None'}")
            self.model = genai.GenerativeModel('gemini-flash-latest')

    async def extract_prescription_data(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict:
        """
        Extracts structured prescription data from an image using Gemini Flash.
        """
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY is missing. Please set it in your .env file.")

        try:
            # Create the image part directly with bytes and mime_type
            # This avoids using PIL.Image objects which were causing issues with the genai library
            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }

            prompt = """
            You are an expert medical pharmacist assistant. Analyze this prescription image and extract the following information in strict JSON format.
            
            Focus ONLY on the Patient Name and the Medicines prescribed. 
            IGNORE:
            - Hospital details (headers, footers, logos)
            - Doctor names/degrees
            - Patient Address
            - Vitals (Temperature, BP, Pulse, Weight, Height)
            - Clinical Complaints (C/o, Symptoms like 'Fever', 'Body pains')
            
            Return ONLY the JSON object, no markdown formatting or other text.
            
            Structure:
            {
                "patient_name": "Name found",
                "drug_candidates": [
                    {
                        "drug": "Name of drug",
                        "category": "Therapeutic category (e.g., Antibiotic, Painkiller, Supplement)",
                        "description": "A short, simple layman-friendly explanation of what the drug treats (1-2 sentences).",
                        "score": 100,
                        "dosages": ["Tablet", "10ml", etc],
                        "frequencies": ["once daily", "2x daily", etc]
                    }
                ],
                "raw_ocr_text": "Generate a clean summary list of ONLY the Patient Name and Medicines found. Do NOT include vitals, address, or symptoms here."
            }
            
            If a field is not found, return null or empty list.
            """

            response = self.model.generate_content([prompt, image_part])
            
            # Clean response text to ensure valid JSON (sometimes models add ```json ... ```)
            text_response = response.text.strip()
            if text_response.startswith("```json"):
                text_response = text_response[7:]
            if text_response.endswith("```"):
                text_response = text_response[:-3]
            
            data = json.loads(text_response.strip())
            
            # Add metadata to match the expected application format
            data["ocr_engine"] = "gemini-flash-latest"
             # Mock tokens as Gemini doesn't return per-token confidence in this mode easily
            data["tokens"] = [] 
            data["confidence_metrics"] = {
                "avg_token_confidence": 1.0, 
                "note": "Confidence scores not directly available from generative extraction"
            }
            
            # Flatten lists for compatibility if needed or ensure types
            # The current frontend expects specific keys, we try to match them.
            
            # Extract dosages/frequencies to top-level lists for compatibility if the frontend relies on them there
            all_dosages = []
            all_frequencies = {}
            for drug in data.get("drug_candidates", []):
                if "dosages" in drug:
                    all_dosages.extend(drug["dosages"])
                if "frequencies" in drug:
                    # Simple heuristic mapping for the top-level frequency dict
                    for freq in drug["frequencies"]:
                        all_frequencies[freq] = [freq] # map key to pattern list

            data["dosages"] = list(set(all_dosages))
            data["frequencies"] = all_frequencies
            data["dosage_forms"] = [] # Gemini prompt could be improved to extract forms specifically if needed

            return data

        except Exception as e:
            logger.error(f"Gemini extraction failed: {e}")
            raise Exception(f"Gemini extraction failed: {str(e)}")
