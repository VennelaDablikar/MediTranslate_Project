# MediTranslate – Vernacular Healthcare Companion

MediTranslate is an AI-powered web application designed to bridge the gap between complex medical prescriptions and patient understanding. It digitizes, translates, and explains medical prescriptions in simple regional languages, ensuring patients understand their medication regimen.

---

## 🚀 How It Works

MediTranslate operates on a sophisticated pipeline that combines Computer Vision, Optical Character Recognition (OCR), and Large Language Models (LLMs).

1.  **Upload & Preprocessing (Frontend/Backend)**
    *   Users upload a prescription image via the Next.js frontend.
    *   The image is sent to the FastAPI backend.
    *   We use **OpenCV** to preprocess the image (denoising, contrast enhancement) to improve legibility.

2.  **OCR & Text Extraction**
    *   The system uses **Google Vision API** (or fallback engines like TrOCR/Tesseract) to extract raw text from the image.
    *   **Gemini Flash AI** analyzes the raw text to intelligently identify:
        *   **Patient Name**
        *   **Medicines** (Brand/Generic names)
        *   **Dosages** & **Frequencies**

3.  **Medicine Identification & Search**
    *   Extracted drug names are fuzzy-matched against a comprehensive internal database (`medicines.json`) containing thousands of common medicines.
    *   This ensures accurate identification even if the OCR misses a character or two.

4.  **Translation & Presentation**
    *   The results are structured and sent back to the frontend.
    *   Users can view the digital prescription, translate it into languages like Spanish, French, or Hindi, and even listen to audio explanations.

---

## 🛠️ Project Structure

*   **/frontend**: A modern **Next.js 14** application (React, TypeScript, Tailwind CSS) for the user interface.
*   **/backend**: A high-performance **FastAPI** (Python 3.9+) server handling logic, OCR, and database interactions.

---

## ✅ Prerequisites

Ensure you have the following installed:
*   **Python** (v3.9 or higher)
*   **Node.js** (v18 or higher)
*   **Git**

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/VennelaDablikar/MediTranslate_Project.git
cd MediTranslate_Project
```

### 2. Backend Setup
Navigate to the backend directory and install Python dependencies:
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate to the frontend directory and install Node.js dependencies:
```bash
cd ../frontend
npm install
```

### 4. Application Keys (.env)
Create a `.env` file in the **root** folder (`MediTranslate_Project/.env`) and add your API keys:
```ini
# Google Cloud (Required for best OCR results & Gemini)
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
GOOGLE_API_KEY="your-gemini-api-key"

# Database (Supabase)
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-anon-key"
```

---

## ▶️ How to Run

### Option A: The Easy Way (One-Click)
We have included a startup script that launches both the backend and frontend simultaneously.

From the **root** directory:
```bash
chmod +x start.sh  # Only needed the first time
./start.sh
```
This will start:
*   Backend at `http://localhost:8000`
*   Frontend at `http://localhost:3000`

### Option B: Manual Start

**Terminal 1 (Backend):**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using MediTranslate.
