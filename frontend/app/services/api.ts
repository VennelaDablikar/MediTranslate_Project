import { PrescriptionResponse } from "../types/api";

const API_BASE_URL = "http://localhost:8000";

export async function uploadPrescription(file: File): Promise<PrescriptionResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/ocr/extract`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to upload prescription");
    }

    return response.json();
}
