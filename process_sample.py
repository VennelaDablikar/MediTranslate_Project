import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.utils.vision_ocr import extract_patient_name, match_drug_candidates, associate_dosages

# Your provided OCR JSON
ocr_data = {
  "raw_ocr_text": "Nursing Honie\nDate\nVtc |u/os\nWijr\n2(\n|6\nSaturation :\nS9-1.\nWeight\n2k Pulse Rate\nl2 6\nBlood Pressure : |2=\nolqo\nY:\nFeue\n62\nlealrs\nCev\nBucY\nmc ,\ne\nk\nCop=\nQan\n(.f~UeaA\nfyp: Ascccil-0\nM\n~tr)\nbmm(d\n~keuluSof\nimnagar\n505 001\n4033288,0878-3565096\nn985egmail.com\nwwW.\nKame:\nusqvi =\nAge/Gender :\nStl\nSal\nIkorda\nAddress :\nTemperature :\nPam_\n~ade*\n99.3\nsda/\nolbmd\npahs\nAcoax-ct\nDx-\nnm\nCesceu-\nwwwjjayaramhospital_\ncom\ninstagram C\ncom/jayaram\nthospital",
  "tokens": [{"text": t, "confidence": 0.5} for t in "Nursing Honie Date Vtc Wijr Saturation Weight Pulse Rate Blood Pressure Temperature Kame usqvi".split()],
  "drug_candidates": []
}

raw = ocr_data['raw_ocr_text']
tokens = ocr_data['tokens']

# Extract patient name
patient_name = extract_patient_name(raw, tokens)

# Extract medicines
drug_candidates = match_drug_candidates(tokens, raw, min_score=70)
medicines = associate_dosages(drug_candidates, raw)

# Clean format
clean_medicines = [
    {'drug': m.get('drug'), 'dosages': m.get('dosages', []), 'score': m.get('score')}
    for m in medicines if m.get('drug')
]

# Return clean JSON
output = {
    'patient_name': patient_name,
    'medicines': clean_medicines
}

print(json.dumps(output, indent=2))
