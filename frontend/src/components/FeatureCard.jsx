export default function FeatureCard({title, children, icon}){
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  )
}
