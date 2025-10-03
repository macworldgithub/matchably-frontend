import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  startTransition,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  FaArrowLeft,
  FaSearch,
  FaSync,
  FaExternalLinkAlt,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';
import axios from 'axios';
import debounce from 'lodash.debounce';
import config from '../../config';

const priorityOrder = { high: 0, medium: 1, low: 2 };
const priorityLabel = (p) =>
  typeof p === 'string'
    ? p.toUpperCase()
    : ['LOW', 'LOW', 'MEDIUM', 'HIGH', 'HIGH'][p] || 'LOW';

const priorityColor = (p) => {
  const k =
    typeof p === 'string' ? p.toLowerCase() : priorityLabel(p).toLowerCase();
  switch (k) {
    case 'high':
      return 'text-red-400 bg-red-400/10';
    case 'medium':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'low':
      return 'text-green-400 bg-green-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

const icons = {
  tracking: '📦',
  content: '📝',
  extension: '⏰',
  application: '👤',
  recruitment: '📢',
};

const TaskRow = React.memo(({ task, navigate }) => {
  const overdue = task.dueDate && new Date(task.dueDate) < new Date();
  const age = (() => {
    const h = Math.floor((Date.now() - new Date(task.createdAt)) / 36e5);
    return h < 1 ? 'Just now' : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  })();

  const urlMap = {
    tracking: `/brand/campaigns/${task.campaignId}?tab=creators&filter=All&filtermode=trackingPending${task.creatorName ? `&search=${task.creatorName}` : ''}`,
    content: `/brand/campaigns/${task.campaignId}?tab=content`,
    extension: `/brand/campaigns/${task.campaignId}?tab=creators&filter=extensionPending${task.creatorName ? `&search=${task.creatorName}` : ''}`,
    application: `/brand/campaigns/${task.campaignId}?tab=creators&filter=All`,
    recruitment: `/brand/campaigns/${task.campaignId}?tab=creators`,
  };
  const ctaMap = {
    tracking: 'Input Tracking',
    content: 'Review Content',
    extension: 'Review Request',
    application: 'Review Creators',
    recruitment: 'View Campaign',
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2a2a2a] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{icons[task.type] || '📋'}</span>
            <div>
              <h3 className="text-lg font-semibold text-white FontNoto">
                {task.campaignTitle}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${priorityColor(
                    task.priority
                  )}`}
                >
                  {priorityLabel(task.priority)}
                </span>
                <span className="flex items-center space-x-1">
                  <FaClock className="w-3 h-3" />
                  <span>{age}</span>
                </span>
                {overdue && (
                  <span className="flex items-center space-x-1 text-red-400">
                    <FaExclamationTriangle className="w-3 h-3" />
                    <span>Overdue</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-300 FontNoto mb-3">{task.description}</p>
          {task.creatorName && (
            <p className="text-sm text-gray-400 FontNoto">
              Creator:{' '}
              <span className="text-lime-400">{task.creatorName}</span>
            </p>
          )}
        </div>

        <button
          onClick={() =>
            navigate(urlMap[task.type] || `/brand/campaigns/${task.campaignId}`)
          }
          className="bg-lime-500 hover:bg-lime-600 text-black cursor-pointer px-4 py-2 rounded-lg FontNoto flex items-center space-x-2"
        >
          <span>{ctaMap[task.type] || 'View Details'}</span>
          <FaExternalLinkAlt className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
});



const TaskList = React.memo(({ tasks, loading, navigate }) => {
    
    if(loading) {
 return (
    <div className="flex w-full justify-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500" />
    </div>
  ) 
}
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-32 h-32 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
        <h2 className="text-xl font-semibold text-white">🎉 All caught up! You have no pending tasks.</h2>
        <p className="text-gray-400">You’re up to date with all your campaign actions.</p>
        <button
          onClick={() => navigate('/brand/dashboard')}
          className="mt-4 bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg FontNoto"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskRow key={`${t.id}-${t.type}`} task={t} navigate={navigate} />
      ))}
    </div>
  )
})


export default function BrandTasks() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [rawTasks, setRawTasks] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('priority');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('BRAND_TOKEN');

const fetchTabTasks = useCallback(async (page = currentPage) => {
  setListLoading(true);
  try {
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.append('type', activeTab);
    if (searchTerm) params.append('search', searchTerm); // ← Include search in API
    params.append('page', page);

    const { data } = await axios.get(
      `${config.BACKEND_URL}/brand/tasks?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.status === 'success') {
      setRawTasks(data.tasks);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.page || 1);
      if (activeTab === 'all') setSummary(data.summary);
    }
  } catch (e) {
    console.error(e);
    setRawTasks([]);
  } finally {
    setListLoading(false);
  }
}, [activeTab, token, currentPage, searchTerm]); // ← Add searchTerm to dependencies

useEffect(() => {
  fetchTabTasks(1);
}, [searchTerm,activeTab, sortOption]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${config.BACKEND_URL}/brand/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.status === 'success') {
          setSummary(data.summary);
          setRawTasks(data.tasks);
          setTotalPages(data.pagination?.totalPages || 1);
          setCurrentPage(data.pagination?.page || 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    })();
  }, []);

const debouncedSearch = useRef(
  debounce((v) => startTransition(() => setSearchTerm(v.toLowerCase())), 300)
).current;


const tasks = useMemo(() => {
  switch (sortOption) {
    case 'priority':
      return [...rawTasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    case 'dueDate':
      return [...rawTasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    case 'newest':
      return [...rawTasks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    case 'oldest':
      return [...rawTasks].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    default:
      return rawTasks;
  }
}, [rawTasks, sortOption]);

  const counts = summary?.byType || {};
  const total = summary?.total || 0;
  const tabs = [
    { id: 'all', label: 'All', count: total },
    { id: 'tracking', label: 'Tracking', count: counts.tracking || 0 },
    { id: 'content', label: 'Content', count: counts.content || 0 },
    { id: 'extension', label: 'Extension', count: counts.extension || 0 },
    { id: 'application', label: 'Application', count: counts.application || 0 },
    { id: 'recruitment', label: 'Recruitment', count: counts.recruitment || 0 },
  ];

  return (
   <div className="p-6 lg:p-12 min-h-screen bg-[#0d0d0d] text-white">
  <Helmet>
    <title>Your Tasks | Brand Dashboard</title>
  </Helmet>

  {/* Header */}
  <div className="mb-8 flex items-center gap-4">
    <button
      onClick={() => navigate(-1)}
      className="text-gray-400 hover:text-white transition"
    >
      <FaArrowLeft className="w-5 h-5" />
    </button>
    <div>
        <h1 className="text-3xl font-extrabold">Your Tasks Dashboard</h1>
    <p className='text-gray-400 text-sm font-semibold mb-2 '>{total} pending tasks across all campaigns</p>

    </div>
    </div>

  {/* Tabs */}
  <div className="flex flex-wrap gap-3 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => {
          setActiveTab(tab.id);
          setCurrentPage(1);
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeTab === tab.id
            ? 'bg-lime-500 hover:bg-lime-600 text-black shadow-lg'
            : 'bg-[#1f1f1f] text-gray-200 hover:bg-[#2a2a2a]'
        }`}
      >
        {tab.label} <span className="ml-1 text-xs ">({tab.count})</span>
      </button>
    ))}
    <button
      onClick={() => fetchTabTasks(currentPage)}
      className="ml-auto flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
    >
      <FaSync className="animate-spin-slow" />
      <span>Refresh</span>
    </button>
  </div>

  {/* Search + Sort */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
    <div className="relative w-full md:w-1/2">
      <FaSearch className="absolute top-3 left-3 text-gray-400" />
      <input
        onChange={(e) => debouncedSearch(e.target.value)}
        type="text"
        placeholder="Search tasks..."
        className="pl-10 pr-4 py-2 w-full bg-[#1a1a1a] text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-lime-500 transition outline-none"
      />
    </div>

    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 transition outline-none"
    >
      <option value="priority">Sort by Priority</option>
      <option value="dueDate">Sort by Due Date</option>
      <option value="newest">Sort by Newest</option>
      <option value="oldest">Sort by Oldest</option>
    </select>
  </div>

  {/* Task List */}
  <TaskList tasks={tasks} loading={listLoading} navigate={navigate} />

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-8 flex justify-center items-center gap-4">
      <button
        onClick={() => fetchTabTasks(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-[#1f1f1f] hover:bg-[#2a2a2a] disabled:opacity-50 transition"
      >
        Previous
      </button>
      <span className="text-sm text-gray-400">
        Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
        <span className="text-white font-semibold">{totalPages}</span>
      </span>
      <button
        onClick={() => fetchTabTasks(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-[#1f1f1f] hover:bg-[#2a2a2a] disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  )}
</div>

  );
}
