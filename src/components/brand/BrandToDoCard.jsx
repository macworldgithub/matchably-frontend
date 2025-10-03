import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrandToDoCard({ campaigns = [], className = "" }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    generateTasks();
  }, [campaigns]);

  const generateTasks = () => {
    const todoTasks = [];

    // Count pending content submissions
    const pendingSubmissions = campaigns.reduce((count, campaign) => {
      return count + (campaign.pendingSubmissions || 0);
    }, 0);

    if (pendingSubmissions > 0) {
      todoTasks.push({
        id: 1,
        text: `Review ${pendingSubmissions} content submission${pendingSubmissions > 1 ? 's' : ''}`,
        action: 'Review',
        onClick: () => navigate('/brand/campaigns'),
        priority: 1
      });
    }

    // Count pending creator applications
    const pendingApplications = campaigns.reduce((count, campaign) => {
      return count + (campaign.pendingApplications || 0);
    }, 0);

    if (pendingApplications > 0) {
      todoTasks.push({
        id: 2,
        text: `Approve ${pendingApplications} creator application${pendingApplications > 1 ? 's' : ''}`,
        action: 'Review',
        onClick: () => navigate('/brand/campaigns'),
        priority: 2
      });
    }

    // Count campaigns needing tracking numbers
    const needsTracking = campaigns.filter(c => 
      c.status === 'active' && c.approvedCreators > 0 && !c.hasTracking
    ).length;

    if (needsTracking > 0) {
      todoTasks.push({
        id: 3,
        text: 'Enter tracking number',
        action: 'Input',
        onClick: () => navigate('/brand/campaigns'),
        priority: 3
      });
    }

    // Count draft campaigns
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
    if (draftCampaigns > 0) {
      todoTasks.push({
        id: 4,
        text: `Complete ${draftCampaigns} draft campaign${draftCampaigns > 1 ? 's' : ''}`,
        action: 'Edit',
        onClick: () => navigate('/brand/campaigns'),
        priority: 4
      });
    }

    // Count campaigns ending soon (within 3 days)
    const endingSoon = campaigns.filter(c => {
      if (c.status !== 'active' || !c.deadline) return false;
      const deadline = new Date(c.deadline);
      const today = new Date();
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 3 && daysLeft >= 0;
    }).length;

    if (endingSoon > 0) {
      todoTasks.push({
        id: 5,
        text: `${endingSoon} campaign${endingSoon > 1 ? 's' : ''} ending soon`,
        action: 'Review',
        onClick: () => navigate('/brand/campaigns'),
        priority: 0 // Highest priority
      });
    }

    // Sort by priority and take top 5
    const sortedTasks = todoTasks
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);

    setTasks(sortedTasks);
  };

  if (tasks.length === 0) {
    return null; // Don't show widget if no tasks
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#E0FFFA] FontNoto flex items-center gap-2">
          📋 Brand To-Do
        </h2>
        <button
          onClick={() => navigate('/brand/tasks')}
          className="text-lime-400 hover:text-lime-300 text-sm underline FontNoto"
        >
          See All Tasks
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="text-gray-300 text-sm FontNoto flex-1">
              • {task.text}
            </span>
            <button
              onClick={task.onClick}
              className="bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 px-3 py-1 rounded text-xs FontNoto transition-colors ml-3 flex-shrink-0"
            >
              [{task.action}]
            </button>
          </div>
        ))}
      </div>

      {tasks.length >= 5 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => navigate('/brand/tasks')}
            className="w-full text-center text-gray-400 hover:text-lime-400 text-sm FontNoto transition-colors"
          >
            Show More Tasks →
          </button>
        </div>
      )}
    </div>
  );
}
