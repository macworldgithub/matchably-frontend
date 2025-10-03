import { useState } from "react";
import BrandDraftTab from "../../pages/brandpages/BrandDraftTab";
import BrandActiveTab from "../../pages/brandpages/BrandActiveTab";
import BrandCompletedTab from "../../pages/brandpages/BrandCompletedTab";

export default function BrandTabs() {
  const [activeTab, setActiveTab] = useState("draft");

  return (
    <div className="mt-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("draft")}
          className={`px-4 py-2 rounded ${activeTab === "draft" ? "bg-indigo-600 text-white" : "bg-white text-black shadow"}`}
        >
          Draft
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded ${activeTab === "active" ? "bg-indigo-600 text-white" : "bg-white text-black shadow"}`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded ${activeTab === "completed" ? "bg-indigo-600 text-white" : "bg-white text-black shadow"}`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {activeTab === "draft" && <BrandDraftTab />}
        {activeTab === "active" && <BrandActiveTab />}
        {activeTab === "completed" && <BrandCompletedTab />}
      </div>
    </div>
  );
}
