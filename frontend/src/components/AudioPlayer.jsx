export default function AudioPlayer({ audioUrl }) {
  if (!audioUrl) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-2">Audio Explanation</h2>

      <audio controls className="w-full mt-2">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
