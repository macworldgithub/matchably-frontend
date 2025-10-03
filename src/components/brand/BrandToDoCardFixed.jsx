import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';

// === LocalStorage Helpers ===
const getCompletedTasks = () =>
JSON.parse(localStorage.getItem('brandCompletedTasks') || '[]');

const markTaskAsDone = (id) => {
  const done = getCompletedTasks();
  const updated = [...new Set([...done, id])];
  localStorage.setItem('brandCompletedTasks', JSON.stringify(updated));
};

const resetCompletedTasks = () => {
  localStorage.removeItem('brandCompletedTasks');
};

// === Empty State Illustration ===
const EmptyIllustration = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-400 py-8 space-y-3">
  <svg
  width="100"
  height="100"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.5"
  viewBox="0 0 24 24"
  className="text-gray-500"
  >
  <path
  strokeLinecap="round"
  strokeLinejoin="round"
  d="M9 12h6m-6 4h6m-2 4h-2a2 2 0 01-2-2v-1h6v1a2 2 0 01-2 2zm4-16H7a2 2 0 00-2 2v11h14V6a2 2 0 00-2-2z"
  />
  </svg>
  <p className="text-sm">🎉 All caught up! You have no pending tasks.</p>
  <p className="text-xs text-gray-500">You’re up to date with all your campaign actions.</p>
  <button
  onClick={() => navigate('/brand/dashboard')}
  className="text-lime-400 hover:text-lime-300 text-xs underline"
  >
  Go to Dashboard →
  </button>
  </div>
);

// === Main Component ===
export default function BrandToDoCardFixed({ campaigns = [] }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    generateTasks();
  }, [campaigns]);

  const generateTasks = () => {
    const todoTasks = [];
    const today = new Date();

    campaigns.forEach((campaign) => {
      const {
        id,
        title,
        status,
        deadline,
        pendingSubmissions,
        pendingApplications,
        approvedCreators,
        hasTracking,
        pendingExtensions,
        needsRecruitment,
      } = campaign;

      if (status !== 'active') return;

      // 1. Ending Soon
      if (deadline) {
        const daysLeft = (new Date(deadline) - today) / (1000 * 60 * 60 * 24);
        if (daysLeft <= 3 && daysLeft >= 0) {
          todoTasks.push({
            id: `ending-${id}`,
            text: `“${title}” ending soon`,
            action: 'View',
            onClick: () => navigate(`/brand/campaigns/${id}`),
                         priority: 0,
          });
          return;
        }
      }

      // 2. Tracking
      if (approvedCreators > 0 && !hasTracking) {
        todoTasks.push({
          id: `tracking-${id}`,
          text: `Enter tracking for “${title}”`,
          action: 'Input',
          onClick: () =>
          navigate(`/brand/campaigns/${id}?tab=creators&filter=trackingPending`),
                       priority: 1,
        });
        return;
      }

      // 3. Content Submissions
      if (pendingSubmissions > 0) {
        todoTasks.push({
          id: `submissions-${id}`,
          text: `Review ${pendingSubmissions} content submission${pendingSubmissions > 1 ? 's' : ''} in “${title}”`,
          action: 'Review',
          onClick: () => navigate(`/brand/campaigns/${id}/content`),
                       priority: 2,
        });
        return;
      }

      // 4. Applications
      if (pendingApplications > 0) {
        todoTasks.push({
          id: `applications-${id}`,
          text: `Approve ${pendingApplications} application${pendingApplications > 1 ? 's' : ''} in “${title}”`,
          action: 'Review',
          onClick: () =>
          navigate(`/brand/campaigns/${id}?tab=creators&filter=applied`),
                       priority: 3,
        });
        return;
      }

      // 5. Extension Requests
      if (pendingExtensions > 0) {
        todoTasks.push({
          id: `extension-${id}`,
          text: `Review ${pendingExtensions} extension request${pendingExtensions > 1 ? 's' : ''} in “${title}”`,
          action: 'Review',
          onClick: () =>
          navigate(`/brand/campaigns/${id}?tab=creators&filter=extensionPending`),
                       priority: 4,
        });
        return;
      }

      // 6. Recruitment
      if (needsRecruitment) {
        todoTasks.push({
          id: `recruitment-${id}`,
          text: `Recruit creators for “${title}”`,
          action: 'View',
          onClick: () => navigate(`/brand/campaigns/${id}`),
                       priority: 5,
        });
        return;
      }
    });

    const completed = getCompletedTasks();
    const filtered = todoTasks.filter((t) => !completed.includes(t.id));
    const sorted = filtered.sort((a, b) => a.priority - b.priority).slice(0, 5);
    setTasks(sorted);
  };

  if (!isVisible) return null;

  // For reuse in both views
  const tasksToShow = tasks;

  // === Desktop View ===
  const DesktopCard = (
    <div className="hidden lg:block fixed bottom-6 right-6 w-80 z-50">
    <div className="bg-[#1a1a1a] border border-white/20 rounded-2xl shadow-xl backdrop-blur">
    <div className="flex justify-between items-center p-4 border-b border-white/10">
    <h3 className="text-sm font-semibold text-[#E0FFFA]">📋 Brand To-Do</h3>
    <div className="flex gap-2">
    <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white">
    {isMinimized ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
    </button>
    <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
    <FaTimes size={12} />
    </button>
    </div>
    </div>
    {!isMinimized && (
      <div className="p-4 space-y-3">
      {tasksToShow.length > 0 ? (
        tasksToShow.map((task) => (
          <div
          key={task.id}
          className="flex justify-between items-center text-sm bg-white/5 hover:bg-white/10 p-2 rounded-lg"
          >
          <span className="text-gray-300">• {task.text}</span>
          <div className="flex items-center gap-2">
          <button
          onClick={task.onClick}
          className="bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 text-xs px-2 py-1 rounded"
          >
          [{task.action}]
          </button>
          <button
          onClick={() => {
            markTaskAsDone(task.id);
            generateTasks();
          }}
          className="text-green-400 hover:text-green-300 text-xs"
          title="Mark as done"
          >
          ✓
          </button>
          </div>
          </div>
        ))
      ) : (
        <EmptyIllustration navigate={navigate} />
      )}
      {tasksToShow.length > 0 && (
        <button
        onClick={() => navigate('/brand/tasks')}
        className="w-full text-center text-xs text-gray-400 hover:text-lime-400 border-t pt-3 border-white/10"
        >
        See All Tasks →
        </button>
      )}
      </div>
    )}
    </div>
    </div>
  );

  // === Mobile View ===
  const MobileCard = (
    <div className="lg:hidden bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
    <div className="flex justify-between items-center mb-3">
    <h3 className="text-lg text-[#E0FFFA] font-semibold">📋 Brand To-Do</h3>
    <button
    onClick={() => navigate('/brand/tasks')}
    className="text-lime-400 text-sm underline"
    >
    See All Tasks
    </button>
    </div>

    {tasksToShow.length > 0 ? (
      tasksToShow.map((task) => (
        <div
        key={task.id}
        className="flex justify-between items-center bg-white/10 hover:bg-white/20 p-3 rounded-lg"
        >
        <span className="text-gray-300 text-sm flex-1">• {task.text}</span>
        <button
        onClick={task.onClick}
        className="bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 px-3 py-1 rounded text-xs ml-2"
        >
        [{task.action}]
        </button>
        </div>
      ))
    ) : (
      <EmptyIllustration navigate={navigate} />
    )}

    {tasksToShow.length >= 5 && (
      <div className="text-center pt-3 border-t border-white/10">
      <button
      onClick={() => navigate('/brand/tasks')}
      className="text-sm text-gray-400 hover:text-lime-400"
      >
      Show More Tasks →
      </button>
      </div>
    )}
    </div>
  );

  return (
    <>
    {DesktopCard}
    {MobileCard}
    </>
  );
}
