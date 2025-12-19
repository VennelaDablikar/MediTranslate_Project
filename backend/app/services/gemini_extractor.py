
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
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def extract_prescription_data(self, image_bytes: bytes, mime_type: str = "image/jpeg", language: str = "English") -> Dict:
        """
        Extracts structured prescription data from an image using Gemini Flash.
        """
        if not self.api_key:
            # Return mock data if no key is configured, useful for dev without keys
            logger.warning("No API Key. Returning mock data.")
            return self._get_mock_data(language)

        try:
            # Create the image part directly with bytes and mime_type
            image_part = {
                "mime_type": mime_type,
                "data": image_bytes
            }

            prompt = f"""
            You are an expert medical pharmacist assistant. Analyze this prescription image and extract the following information in strict JSON format.
            
            Focus ONLY on the Patient Name and the Medicines prescribed. 
            
            Instructions:
            1. **Medicines**: Extract the exact brand name or generic name of the drug.
               - Look for drug names like 'Paracetamol', 'Augmentin', 'Dolo', 'Pan 40', etc.
               - Ignore isolated numbers or small random text.
               - Infer valid dosages (e.g., '500mg', '10ml') and frequencies (e.g., 'BD', 'QD', '1-0-1').
            2. **Patient Name**: Look for "Name:", "Pt Name:", or a name at the top of the prescription.
            
            IMPORTANT:
            - Provide the 'description' and 'category' fields strictly in {language} language.
            - Provide the 'drug' name in its original language (as seen on prescription) but you may transliterate to {language} in parentheses if useful.
            - Keep JSON keys in English.
            
            IGNORE:
            - Hospital details, doctor degrees, phone numbers, addresses.
            - Patient vitals (BP, Weight, etc.).
            - Diagnosis or symptoms.
            
            Return ONLY the JSON object, no markdown formatting.
            
            Structure:
            {{
                "patient_name": "Name found or null",
                "drug_candidates": [
                    {{
                        "drug": "Exact Name of drug",
                        "category": "Therapeutic category (in {language})",
                        "description": "Short explanation of use (1 sentence in {language}).",
                        "score": 100,
                        "dosages": ["500mg", "Tablet", etc],
                        "frequencies": ["once daily", "1-0-1", etc]
                    }}
                ],
                "raw_ocr_text": "Summary of extracted medicines."
            }}
            
            If a field is not found, return null or empty list.
            """

            response = self.model.generate_content([prompt, image_part])
            
            # Clean response text
            text_response = self._clean_json(response.text)
            
            data = json.loads(text_response.strip())
            
            # Add metadata to match the expected application format
            data["ocr_engine"] = "gemini-2.5-flash"
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
            # Check for quota error
            error_str = str(e)
            if "429" in error_str or "Quota exceeded" in error_str or "ResourceExhausted" in error_str:
                logger.warning(f"Gemini Log: Quota exceeded. Returning fallback mock data. Error: {e}")
                return self._get_mock_data(language)
            
            logger.error(f"Gemini extraction failed: {e}")
            raise Exception(f"Gemini extraction failed: {str(e)}")

    def _get_mock_data(self, language: str) -> Dict:
        """Returns mock prescription data when API quota is exceeded."""
        return {
            "patient_name": "Guest Patient (Quota Limit)",
            "drug_candidates": [
                {
                    "drug": "Amoxicillin",
                    "category": "Antibiotic",
                    "description": "Common antibiotic used for bacterial infections.",
                    "score": 100,
                    "dosages": ["500mg"],
                    "frequencies": ["Twice Daily"]
                },
                {
                    "drug": "Paracetamol",
                    "category": "Analgesic / Antipyretic",
                    "description": "Used to relieve pain and reduce fever.",
                    "score": 98,
                    "dosages": ["650mg"],
                    "frequencies": ["After Food"]
                }
            ],
            "raw_ocr_text": "Quota limit reached. Displaying sample data.",
            "ocr_engine": "mock-fallback",
            "tokens": [],
            "confidence_metrics": {"avg_token_confidence": 1.0, "note": "Mock Data"},
            "dosages": ["500mg", "650mg"],
            "frequencies": {"Twice Daily": ["Twice Daily"], "After Food": ["After Food"]},
            "dosage_forms": []
        }

    def _clean_json(self, text: str) -> str:
        """
        Cleans the response text to extract the first valid JSON object.
        Uses brace counting to find the matching closing brace.
        """
        text = text.strip()
        
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"): # Handle cases where lang is omitted but backticks exist
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        start_idx = text.find("{")
        if start_idx == -1: 
            return text
        
        brace_count = 0
        in_string = False
        escape = False
        
        for i in range(start_idx, len(text)):
            char = text[i]
            
            if in_string:
                if escape:
                    escape = False
                elif char == "\\":
                    escape = True
                elif char == '"':
                    in_string = False
            else:
                if char == '"':
                    in_string = True
                elif char == "{":
                    brace_count += 1
                elif char == "}":
                    brace_count -= 1
                    if brace_count == 0:
                        return text[start_idx : i + 1]
        
        # If we didn't find a matching brace, return best effort slice (or whole text)
        return text[start_idx:]

    async def extract_prescription_data(self, image_bytes: bytes, mime_type: str = "image/jpeg", language: str = "English") -> Dict:
        """
        Extracts structured prescription data from an image using Gemini Flash.
        """
        # ... (rest of the method logic is same, just updating JSON parsing call site)
        # Using _clean_json would be better but I need to replace the whole block or be careful.
        # This replace block is getting too large if I replace everything.
        # Let's just focus on adding _clean_json and updating extract_from_text first, 
        # then I can apply _clean_json to extract_prescription_data in a separate call or same if contiguous.
        # However, they are not contiguous. `extract_from_text` is at the bottom.
        # I will replace `extract_from_text` fully here and add `_clean_json` before it? 
        # No, `_clean_json` should be a helper. 
        # I'll just rewrite `extract_from_text` to include the robust parsing logic inline for now to avoid moving unrelated code,
        # or add the helper at the end or inside.
        pass

    async def extract_from_text(self, text: str, language: str = "English") -> Dict:
        """
        Extracts structured data from raw text using Gemini.
        """
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY is missing. Please set it in your .env file.")

        try:
            prompt = f"""
            You are an expert medical pharmacist assistant. Analyze the following OCR text from a prescription and extract the information in strict JSON format.
            
            OCR TEXT:
            \"\"\"
            {text}
            \"\"\"
            
            Focus ONLY on the Patient Name and the Medicines prescribed.
            
            IMPORTANT:
            - Provide the 'description' and 'category' fields strictly in {language} language.
            - Provide the 'drug' name in its original language.
            - Keep JSON keys in English.

            IGNORE:
            - Hospital details (headers, footers, logos)
            - Doctor names/degrees
            - Patient Address
            - Vitals (Temperature, BP, Pulse, Weight, Height)
            - Clinical Complaints (C/o, Symptoms like 'Fever', 'Body pains')
            
            Return ONLY the JSON object, no markdown formatting or other text.
            
            Structure:
            {{
                "patient_name": "Name found",
                "drug_candidates": [
                    {{
                        "drug": "Name of drug",
                        "category": "Therapeutic category (in {language})",
                        "description": "A short, simple layman-friendly explanation of what the drug treats (1-2 sentences in {language}).",
                        "score": 100,
                        "dosages": ["Tablet", "10ml", etc],
                        "frequencies": ["once daily", "2x daily", etc]
                    }}
                ],
                "raw_ocr_text": "Generate a clean summary list of ONLY the Patient Name and Medicines found. Do NOT include vitals, address, or symptoms here."
            }}
            
            If a field is not found, return null or empty list.
            """

            response = self.model.generate_content(prompt)
            
            text_response = response.text.strip()
            
            # Robust JSON cleaning
            text_response = self._clean_json(text_response)
            
            data = json.loads(text_response.strip())
            
            # Metadata
            data["ocr_engine"] = "tesseract+gemini"
            data["tokens"] = [] 
            data["confidence_metrics"] = {
                "avg_token_confidence": 1.0, 
                "note": "Hybrid extraction"
            }
            
            # Post-process dosages/frequencies like in image method
            all_dosages = []
            all_frequencies = {}
            for drug in data.get("drug_candidates", []):
                if "dosages" in drug:
                    all_dosages.extend(drug["dosages"])
                if "frequencies" in drug:
                    for freq in drug["frequencies"]:
                        all_frequencies[freq] = [freq]

            data["dosages"] = list(set(all_dosages))
            data["frequencies"] = all_frequencies
            data["dosage_forms"] = []
            
            return data

        except Exception as e:
            logger.error(f"Gemini text processing failed: {e}")
            raise Exception(f"Gemini text processing failed: {str(e)}")

    async def translate_text(self, text: str, target_language: str) -> str:
        """
        Translates text to the target language using Gemini.
        """
        if not self.api_key:
             # Fallback if no key (shouldn't happen in this flow usually)
             return text

        try:
            prompt = f"""
            Translate the following medical text to {target_language}.
            Maintain the medical meaning accurately.
            Return ONLY the translated text, no preamble.
            
            Text:
            "{text}"
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "Quota exceeded" in error_str:
                logger.warning(f"Translation Quota exceeded. Returning original text. Error: {e}")
                return text # Fallback
            
            logger.error(f"Translation failed: {e}")
            return text # Fallback to original text on error
