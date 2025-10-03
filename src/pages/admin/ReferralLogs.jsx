import React, { useEffect, useState } from 'react';
import config from '../../config';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ITEMS_PER_PAGE = 10;

const ReferralLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const token = Cookies.get('AdminToken') || localStorage.getItem('token');

  useEffect(() => {
    fetch(`${config.BACKEND_URL}/admin/referrel/points/logs`, {
      headers: { authorization: token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const sorted = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLogs(sorted);
          setFilteredLogs(sorted);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error('Failed to load referral logs'));
  }, [token]);

  const handleSearch = e => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setPage(1);
    setFilteredLogs(
      logs.filter(
        log =>
          log.user?.toLowerCase().includes(term) ||
          log.referrer?.toLowerCase().includes(term)
      )
    );
  };

  const handleSortByDate = () => {
    setFilteredLogs(prev =>
      [...prev].sort((a, b) =>
        sortAsc
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      )
    );
    setSortAsc(!sortAsc);
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const goToPage = n => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Point Logs</h2>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 
                     3.476l4.817 4.817a1 1 0 01-1.414 
                     1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 
                         bg-white border border-gray-300 rounded-lg w-80 
                         focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by email or name"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 
                            dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Invitee
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer select-none"
                onClick={handleSortByDate}
              >
                Date {sortAsc ? '▲' : '▼'}
              </th>
              <th scope="col" className="px-6 py-3">
                Points
              </th>
              <th scope="col" className="px-6 py-3">
                Note
              </th>
              <th scope="col" className="px-6 py-3">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log, i) => (
                <tr
                  key={i}
                  className="bg-white border-b dark:bg-gray-800 
                             dark:border-gray-700 border-gray-200 
                             hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{log.user || '—'}</td>
                  <td className="px-6 py-4">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{log.points}</td>
                  <td className="px-6 py-4">{log.note || '—'}</td>
                  <td className="px-6 py-4 capitalize">
                    {log.source?.replace('-', ' ') || '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-gray-400"
                >
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded 
                       disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded 
                       disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferralLogs;
