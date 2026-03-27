
export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      
      <h4 className="text-gray-500 text-sm">{title}</h4>
      
      <p className="text-2xl font-bold mt-2">{value}</p>

    </div>
  );
}