export default function BrandPlanInfoCard() {
  return (
    <div className="p-4 bg-white shadow rounded mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Your Plan</h2>
        <p className="text-sm text-gray-600">Single Plan • 1/1 Used • Expires: Aug 30, 2025</p>
      </div>
      <button className="text-indigo-600 font-semibold hover:underline">Upgrade Plan</button>
    </div>
  );
}