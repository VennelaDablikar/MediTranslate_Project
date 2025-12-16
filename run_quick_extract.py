import json
import sys, os
# ensure backend package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
from app.utils.vision_ocr import extract_patient_name, match_drug_candidates

# Paste user OCR output here (truncated for brevity)
user_output = {
  "raw_ocr_text": "Nursing Honie\nDate\nVtc |u/os\nWijr\n2(\n|6\nSaturation :\nS9-1.\nWeight\n2k Pulse Rate\nl2 6\nBlood Pressure : |2=\nolqo\nY:\nFeue\n62\nlealrs\nCev\nBucY\nmc ,\ne\nk\nCop=\nQan\n(.f~UeaA\nfyp: Ascccil-0\nM\n~tr)\nbmm(d\n~keuluSof\nimnagar\n505 001\n4033288,0878-3565096\nn985egmail.com\nwwW.\nKame:\nusqvi =\nAge/Gender :\nStl\nSal\nIkorda\nAddress :\nTemperature :\nPam_\n~ade*\n99.3\nsda/\nolbmd\npahs\nAcoax-ct\nDx-\nnm\nCesceu-\nwwwjjayaramhospital_\ncom\ninstagram C\ncom/jayaram\nthospital",
  "ocr_engine": "easyocr",
  "tokens": [
    {"text": "Nursing", "confidence": 0.5},
    {"text": "Honie", "confidence": 0.5},
    {"text": "Date", "confidence": 0.5},
    {"text": "Vtc", "confidence": 0.5},
    {"text": "|u/os", "confidence": 0.5},
    {"text": "Wijr", "confidence": 0.5},
    {"text": "2(", "confidence": 0.5},
    {"text": "|6", "confidence": 0.5},
    {"text": "Saturation", "confidence": 0.5},
    {"text": ":", "confidence": 0.5},
    {"text": "S9-1.", "confidence": 0.5},
    {"text": "Weight", "confidence": 0.5},
    {"text": "2k", "confidence": 0.5},
    {"text": "Pulse", "confidence": 0.5},
    {"text": "Rate", "confidence": 0.5},
    {"text": "l2", "confidence": 0.5},
    {"text": "6", "confidence": 0.5},
    {"text": "Blood", "confidence": 0.5},
    {"text": "Pressure", "confidence": 0.5},
    {"text": ":", "confidence": 0.5},
    {"text": "|2=", "confidence": 0.5},
    {"text": "olqo", "confidence": 0.5},
    {"text": "Y:", "confidence": 0.5},
    {"text": "Feue", "confidence": 0.5},
    {"text": "62", "confidence": 0.5},
    {"text": "lealrs", "confidence": 0.5},
    {"text": "Cev", "confidence": 0.5},
    {"text": "BucY", "confidence": 0.5},
    {"text": "mc", "confidence": 0.5},
    {"text": ",", "confidence": 0.5},
    {"text": "e", "confidence": 0.5},
    {"text": "k", "confidence": 0.5},
    {"text": "Cop=", "confidence": 0.5},
    {"text": "Qan", "confidence": 0.5},
    {"text": "(.f~UeaA", "confidence": 0.5},
    {"text": "fyp:", "confidence": 0.5},
    {"text": "Ascccil-0", "confidence": 0.5},
    {"text": "M", "confidence": 0.5},
    {"text": "~tr)", "confidence": 0.5},
    {"text": "bmm(d", "confidence": 0.5},
    {"text": "~keuluSof", "confidence": 0.5},
    {"text": "imnagar", "confidence": 0.5},
    {"text": "505", "confidence": 0.5},
    {"text": "001", "confidence": 0.5},
    {"text": "4033288,0878-3565096", "confidence": 0.5},
    {"text": "n985egmail.com", "confidence": 0.5},
    {"text": "wwW.", "confidence": 0.5},
    {"text": "Kame:", "confidence": 0.5},
    {"text": "usqvi", "confidence": 0.5},
    {"text": "=", "confidence": 0.5},
    {"text": "Age/Gender", "confidence": 0.5},
    {"text": ":", "confidence": 0.5},
    {"text": "Stl", "confidence": 0.5},
    {"text": "Sal", "confidence": 0.5},
    {"text": "Ikorda", "confidence": 0.5},
    {"text": "Address", "confidence": 0.5},
    {"text": ":", "confidence": 0.5},
    {"text": "Temperature", "confidence": 0.5},
    {"text": ":", "confidence": 0.5},
    {"text": "Pam_", "confidence": 0.5},
    {"text": "~ade*", "confidence": 0.5},
    {"text": "99.3", "confidence": 0.5},
    {"text": "sda/", "confidence": 0.5},
    {"text": "olbmd", "confidence": 0.5},
    {"text": "pahs", "confidence": 0.5},
    {"text": "Acoax-ct", "confidence": 0.5},
    {"text": "Dx-", "confidence": 0.5},
    {"text": "nm", "confidence": 0.5},
    {"text": "Cesceu-", "confidence": 0.5},
    {"text": "wwwjjayaramhospital_", "confidence": 0.5},
    {"text": "com", "confidence": 0.5},
    {"text": "instagram", "confidence": 0.5},
    {"text": "C", "confidence": 0.5},
    {"text": "com/jayaram", "confidence": 0.5},
    {"text": "thospital", "confidence": 0.5}
  ],
  "drug_candidates": [],
  "dosages": [],
  "dosage_forms": [],
  "frequencies": {},
  "confidence_metrics": {
    "avg_token_confidence": 0.5,
    "high_confidence_tokens": 0,
    "total_tokens": 75
  }
}

raw = user_output['raw_ocr_text']
tokens = user_output['tokens']

name = extract_patient_name(raw, tokens)
raw_meds = match_drug_candidates(tokens, raw)
from app.utils.vision_ocr import associate_dosages
meds = associate_dosages(raw_meds, raw)

print('Extracted patient_name:', name)
print('Medicines (with dosages):')
for m in meds:
  print('-', m['drug'], '| score:', m['score'], '| dosages:', m['dosages'])
