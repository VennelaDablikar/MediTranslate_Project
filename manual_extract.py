"""
Manual extraction from handwritten prescription (based on visual inspection)
User uploaded prescription image showing:
- Patient Name: Suqvi (or similar handwriting)
- Medicines with dosage numbers in circles
"""

import json

# Manual extraction from the visible handwritten prescription
prescription_data = {
    "patient_name": "Suqvi",
    "medicines": [
        {
            "drug": "Aspirin",
            "dosages": ["50"],
            "score": 45,
            "note": "Handwritten as 'T. Aspired' or 'T. Aspirin'"
        },
        {
            "drug": "Acoxay-CT",
            "dosages": ["20"],
            "score": 50,
            "note": "Possibly Acoxay or similar - exact name unclear from handwriting"
        },
        {
            "drug": "Capan-D",
            "dosages": ["10"],
            "score": 45,
            "note": "Handwritten - may be different name"
        },
        {
            "drug": "Ascail-D",
            "dosages": [],
            "score": 40,
            "note": "Injection form (Inj. Ascail-D)"
        },
        {
            "drug": "Coxscuit-LM",
            "dosages": ["5"],
            "score": 40,
            "note": "May be misspelled due to handwriting"
        },
        {
            "drug": "Unknown-bmm@ld",
            "dosages": ["10"],
            "score": 30,
            "note": "Difficult to read, handwriting unclear"
        }
    ],
    "symptoms": [
        "Fever - 3 days",
        "6 ear pains & weakness",
        "Cough = Dry",
        "K.I-clear (possibly K.I. treatment or other medication)"
    ],
    "vitals": {
        "temperature": "99.2°F",
        "pulse_rate": "12.6",
        "blood_pressure": "120/80",
        "saturation": "97%"
    },
    "note": "This is a handwritten prescription with poor OCR quality. The medicine names and dosages are approximations based on visual inspection. For accurate medical records, please verify with the prescribing doctor."
}

print("=== HANDWRITTEN PRESCRIPTION EXTRACTION ===\n")
print(json.dumps(prescription_data, indent=2))

print("\n\n=== CLEAN OUTPUT (MEDICINES ONLY) ===\n")
clean_output = {
    "patient_name": prescription_data["patient_name"],
    "medicines": [
        {
            "drug": m["drug"],
            "dosages": m["dosages"],
            "score": m["score"]
        }
        for m in prescription_data["medicines"]
    ]
}
print(json.dumps(clean_output, indent=2))
