export default function BrandUpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">You're currently on the Single Plan ($400).</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upgrade to <strong>Starter Plan ($1,200)</strong> for just <strong>$800</strong>.<br/>
          Used campaigns will carry over. Creator count will reset. New plan valid for 6 months.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >Cancel</button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >Confirm Upgrade</button>
        </div>
      </div>
    </div>
  );
}