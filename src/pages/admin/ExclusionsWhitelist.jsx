import React, { useState, useEffect } from "react";

const ExclusionsWhitelist = ({ excluded = [], whitelisted = [], onRemove, onAdd }) => {
  const [tab, setTab] = useState("excluded");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");

  const data = tab === "excluded" ? excluded : whitelisted;

  const filteredData = data.filter(c =>
    c.username.includes(search) &&
    (platform ? c.platform === platform : true)
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 rounded-t font-medium ${
            tab === "excluded" ? "bg-[#1f1f1f] text-red-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setTab("excluded")}
        >
          Excluded
        </button>
        <button
          className={`px-4 py-2 rounded-t font-medium ${
            tab === "whitelisted" ? "bg-[#1f1f1f] text-green-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setTab("whitelisted")}
        >
          Whitelisted
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-[#1f1f1f] p-4 rounded-lg">
        <input
          placeholder="Search by handle/ID/tag"
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white w-full sm:w-64"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
          value={platform} onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">All Platforms</option>
          <option>TikTok</option>
          <option>Instagram</option>
        </select>
        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white" onClick={() => {setSearch(""); setPlatform("");}}>Reset</button>
        <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Apply</button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1f1f1f] text-gray-400">
            <tr>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Platform</th>
              <th className="px-4 py-2">{tab === "excluded" ? "Reason" : "Tag"}</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(c => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-[#2a2a2a]">
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={c.avatar} alt={c.username} className="w-6 h-6 rounded-full" />
                  {c.username}
                </td>
                <td className="px-4 py-2">{c.platform}</td>
                <td className="px-4 py-2">{tab === "excluded" ? c.reason : c.tag}</td>
                <td className="px-4 py-2">{c.dateAdded}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-2 py-1 rounded text-sm ${
                      tab === "excluded" ? "bg-green-600 hover:bg-green-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                    }`}
                    onClick={() => onRemove?.(c.id, tab)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ExclusionsWhitelist;
