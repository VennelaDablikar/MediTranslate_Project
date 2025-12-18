# MediTranslate – Vernacular Healthcare Companion

MediTranslate is an AI-powered web application that translates
medical prescriptions into simple regional languages.

## Problem
Many patients cannot understand English medical prescriptions,
leading to medication errors and poor healthcare outcomes.

## Solution
This system uses OCR + NLP + Translation + Text-to-Speech
to explain prescriptions in local languages with voice support.

## Features
- Handwritten prescription OCR
- Medical term correction
- Dosage extraction
- Vernacular translation
- Audio explanation

## Tech Stack
- Backend: FastAPI
- OCR: Google Vision API
- NLP: spaCy, RapidFuzz
- Database: Supabase

## How to Run

### Backend
```bash
uvicorn app.main:app --reload
