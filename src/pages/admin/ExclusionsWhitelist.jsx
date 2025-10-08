import React, { useState, useEffect } from "react";

const ExclusionsWhitelist = ({ excluded = [], whitelisted = [], onRemove, onAdd }) => {
  const [tab, setTab] = useState("excluded");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [reason, setReason] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");

  const data = tab === "excluded" ? excluded : whitelisted;

  const filteredData = data.filter(c =>
    c.username.includes(search) &&
    (platform ? c.platform === platform : true)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Title and Description */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Exclusions & Whitelist</h1>
        <p className="text-gray-400 text-sm">
          Manage creators who are either excluded from or force-included in recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 rounded-t font-medium ${
            tab === "exclusion" ? "bg-[#1f1f1f] text-red-500" : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setTab("exclusion")}
        >
          Exclusion
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

      {/* Filters Title */}
      {/* <div className="mb-2">
        <h2 className="text-sm font-medium text-gray-400">Filters</h2>
      </div> */}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-[#1f1f1f] p-4 rounded-lg">
        {/* Search Field */}
        <div className="flex flex-col gap-1">
          <label className="text-md text-gray-400">Search handle, Creator ID or Tag</label>
          <input
            placeholder="Search handle or Creator ID"
            className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white w-full sm:w-64"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Platform Field */}
        <div className="flex flex-col gap-1">
          <label className="text-md text-gray-400">Platform</label>
          <select
            className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
            value={platform} onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Platform</option>
            <option>TikTok</option>
            <option>Instagram</option>
          </select>
        </div>

        {/* Reason Field */}
        <div className="flex flex-col gap-1">
          <label className="text-md text-gray-400">Reason</label>
          <select
            className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
            value={reason} onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Reason</option>
            <option>Spam</option>
            <option>Inappropriate Content</option>
            <option>Low Quality</option>
            <option>Other</option>
          </select>
        </div>

        {/* Registration Date Field */}
        <div className="flex flex-col gap-1">
          <label className="text-md text-gray-400 ">Registration date</label>
          <input
            type="text"
            placeholder="Apr rgle"
            className="bg-[#141414] border border-gray-700 rounded px-2 py-1 text-white"
            value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)}
          />
        </div>

        <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white" onClick={() => {setSearch(""); setPlatform(""); setReason(""); setRegistrationDate("");}}>Reset</button>
        <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Apply</button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-[#1f1f1f] text-gray-400">
            <tr>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Platform</th>
              <th className="px-4 py-2">{tab === "exclusion" ? "Reason" : "Tag"}</th>
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
