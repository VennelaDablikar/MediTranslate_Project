import { supabase } from "./supabase";
import { PrescriptionResponse } from "../types/api";

const API_BASE_URL = "http://localhost:8000";

export async function uploadPrescription(file: File, language: string = "English"): Promise<PrescriptionResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

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

// Helper to upload file to Supabase Storage
async function uploadImageToStorage(userId: string, file: File): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('scans') // Ensure this bucket exists in Supabase
            .upload(filePath, file);

        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            return null;
        }

        const { data } = supabase.storage.from('scans').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error("Upload exception:", error);
        return null;
    }
}

export async function saveScanToSupabase(userId: string, data: PrescriptionResponse, file?: File) {
    let imageUrl = null;

    if (file) {
        imageUrl = await uploadImageToStorage(userId, file);
    }

    const { error } = await supabase
        .from('scans')
        .insert({
            user_id: userId,
            patient_name: data.patient_name,
            results: data,
            image_url: imageUrl,
            created_at: new Date().toISOString()
        });

    if (error) {
        console.error("Error saving scan:", error);
        throw error;
    }
}

export async function fetchUserScans(userId: string) {
    const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching scans:", error);
        throw error;
    }
    return data;
}
