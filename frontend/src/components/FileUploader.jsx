import { useState } from "react";

export default function FileUploader({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
        id="uploadInput"
      />

      <label htmlFor="uploadInput" className="cursor-pointer">
        <p className="text-gray-600 mb-3">Click to upload or drag a prescription image</p>
        <div className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block">
          Choose File
        </div>
      </label>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-4 rounded-lg shadow mx-auto w-64"
        />
      )}
    </div>
  );
}
