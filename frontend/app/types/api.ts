export interface DrugCandidate {
    drug: string;
    category?: string;
    description?: string;
    score?: number;
    dosages?: string[];
    frequencies?: string[];
}

export interface PrescriptionResponse {
    patient_name: string | null;
    drug_candidates: DrugCandidate[];
    raw_ocr_text?: string;
    ocr_engine?: string;
}
