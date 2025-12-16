import { useState } from "react";
import { OCR_API } from "../services/api";

export default function useUpload() {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadAndExtract = async () => {
    if (!file) return { error: "Please select a file" };

    setLoading(true);
    try {
      const res = await OCR_API(file);
      setOcrText(res.extracted_text);
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      return { error: "Failed to extract text" };
    }
  };

  return {
    file,
    setFile,
    ocrText,
    uploadAndExtract,
    loading,
  };
}
