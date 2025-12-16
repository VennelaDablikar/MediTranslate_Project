const BASE_URL = "http://localhost:8000";

export const OCR_API = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/ocr/extract`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const NLP_CORRECT_API = async (text) => {
  const res = await fetch(`${BASE_URL}/nlp/correct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return res.json();
};

export const DOSAGE_API = async (text) => {
  const res = await fetch(`${BASE_URL}/dosage/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return res.json();
};

export const TRANSLATE_API = async (text) => {
  const res = await fetch(`${BASE_URL}/translate/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return res.json();
};

export const AUDIO_API = async (text) => {
  const res = await fetch(`${BASE_URL}/audio/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return res.json();
};
