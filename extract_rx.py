import sys, os, json
sys.path.insert(0, 'backend')

from app.utils.vision_ocr import process_prescription_image, associate_dosages

# Load and process the prescription image
with open('prescription.jpg', 'rb') as f:
    image_bytes = f.read()

print("[Processing prescription image...]")
result = process_prescription_image(image_bytes)

# Extract clean output: patient name + medicines only
patient_name = result.get('patient_name')
drug_candidates = result.get('drug_candidates', [])
medicines = associate_dosages(drug_candidates, result.get('raw_ocr_text', ''))

clean_medicines = [
    {'drug': m.get('drug'), 'dosages': m.get('dosages', []), 'score': m.get('score')}
    for m in medicines if m.get('drug')
]

# Return clean JSON
output = {
    'patient_name': patient_name,
    'medicines': clean_medicines
}

print("\n=== CLEAN PRESCRIPTION OUTPUT ===\n")
print(json.dumps(output, indent=2))
