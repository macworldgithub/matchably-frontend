import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const taskTypes = ['All', 'Tracking', 'Content', 'Extension', 'Application', 'Recruitment'];

const BrandTask = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = [];
        if (selectedType && selectedType.toLowerCase() !== 'all') {
          params.push(`type=${encodeURIComponent(selectedType.toLowerCase())}`);
        }
        if (selectedCampaign) {
          params.push(`search=${encodeURIComponent(selectedCampaign)}`);
        }
        const query = params.length ? `?${params.join('&')}` : '';
        const res = await fetch(`${config.BACKEND_URL}/brand/tasks${query}`);
        const data = await res.json();
        if (data.status === 'success') {
          setTasks(data.tasks);
        } else {
          setError(data.message || 'Failed to fetch tasks');
        }
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedType, selectedCampaign]);

  const filteredTasks = tasks;

  const getCTA = (taskType, campaignId) => {
    const type = (taskType || '').toLowerCase();
    switch (type) {
      case 'tracking':
        return () => navigate(`/brand/campaigns/${campaignId}?tab=creators&filter=trackingPending`);
      case 'content':
        return () => navigate(`/brand/campaigns/${campaignId}/content`);
      case 'extension':
        return () => navigate(`/brand/campaigns/${campaignId}?tab=creators&filter=extensionPending`);
      case 'application':
        return () => navigate(`/brand/campaigns/${campaignId}?tab=creators&filter=applied`);
      case 'recruitment':
        return () => navigate(`/brand/campaigns/${campaignId}?tab=creators`);
      default:
        return () => {};
    }
  };

  // Individual CTA label functions for each type
  const getTrackingCTALabel = (task) => {
    if (task.metadata?.trackingNumber) {
      return 'View Tracking';
    }
    return `Input Tracking${task.creatorName ? ` for ${task.creatorName}` : ''}`;
  };

  const getContentCTALabel = (task) => {
    return 'Review Content';
  };

  const getExtensionCTALabel = (task) => {
    return 'Handle Extension';
  };

  const getApplicationCTALabel = (task) => {
    return 'Review Applications';
  };

  const getRecruitmentCTALabel = (task) => {
    return 'Manage Recruitment';
  };

  const getCTALabel = (task) => {
    switch ((task.type || task.taskType || '').toLowerCase()) {
      case 'tracking':
        return getTrackingCTALabel(task);
      case 'content':
        return getContentCTALabel(task);
      case 'extension':
        return getExtensionCTALabel(task);
      case 'application':
        return getApplicationCTALabel(task);
      case 'recruitment':
        return getRecruitmentCTALabel(task);
      default:
        return 'View Task';
    }
  };

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <p className="text-gray-400">Manage your pending actions across all campaigns.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 justify-between">
        {/* Task Type Filter */}
        <div className="flex gap-2 flex-wrap">
          {taskTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-1 rounded-full border ${
                selectedType === type
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Campaign Name Search */}
        <input
          type="text"
          placeholder="Search Campaign"
          value={selectedCampaign}
          onChange={e => setSelectedCampaign(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-1 rounded-md text-sm placeholder-gray-500"
        />
      </div>

      {/* Loading/Error State */}
      {loading && (
        <div className="text-center mt-16 text-lg text-gray-400">Loading tasks...</div>
      )}
      {error && (
        <div className="text-center mt-16 text-lg text-red-400">{error}</div>
      )}

      {/* Task Table */}
      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-700">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-400">
                <th className="px-4 py-2 text-left">Campaign</th>
                <th className="px-4 py-2 text-left">Task Type</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2 text-indigo-400 cursor-pointer hover:underline">
                    {task.campaignTitle || task.campaignName}
                  </td>
                  <td className="px-4 py-2 capitalize">{task.type || task.taskType}</td>
                  <td className="px-4 py-2">{task.description}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={getCTA(task.type || task.taskType, task.campaignId)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md"
                    >
                      {getCTALabel(task)}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{task.lastUpdated || task.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="text-center mt-16 text-lg text-gray-400">
          🎉 All caught up! You have no pending actions at the moment.
        </div>
      )}
    </div>
  );
};

export default BrandTask;