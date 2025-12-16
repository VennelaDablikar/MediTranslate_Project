export default function DosageCard({ dosageList }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-2">Dosage Detected</h2>

      {dosageList?.length > 0 ? (
        <ul className="list-disc pl-6">
          {dosageList.map((dose, i) => (
            <li key={i} className="text-gray-700">{dose}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No dosage patterns detected.</p>
      )}
    </div>
  );
}
