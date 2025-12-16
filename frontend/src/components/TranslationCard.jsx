export default function TranslationCard({ translated }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-2">Translated Output</h2>

      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
        {translated || "Translation will appear here."}
      </p>
    </div>
  );
}
