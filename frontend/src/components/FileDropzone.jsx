export default function FileDropzone({children}){
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
      {children}
    </div>
  )
}
