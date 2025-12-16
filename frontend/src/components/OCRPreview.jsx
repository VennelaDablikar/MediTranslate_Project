export default function OCRPreview({ text }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
      <pre className="bg-gray-100 p-4 rounded text-gray-700 whitespace-pre-wrap">
        {text || "Waiting for OCR..."}
      </pre>
    </div>
  );
}
