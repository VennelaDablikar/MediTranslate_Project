export default function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg mt-4">
      <strong>Error:</strong> {message}
    </div>
  );
}
