import React, { useState } from 'react';
import config from '../config';

export default function CampaignCards({ campaigns, onCampaignClick, onCampaignDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'draft': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'paused': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'draft': return '📝';
      case 'completed': return '✅';
      case 'paused': return '⏸️';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteClick = (e, campaign) => {
    e.stopPropagation(); // Prevent card click
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    setDeletingId(campaignToDelete.id);
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      const res = await fetch(`${config.BACKEND_URL}/brand/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        onCampaignDeleted(); // Refresh campaigns list
        setShowDeleteModal(false);
        setCampaignToDelete(null);
      } else {
        console.error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCampaignToDelete(null);
  };

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-6 flex items-center gap-2">
          🎯 Your Campaigns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(campaign => {
            const daysLeft = getDaysUntilDeadline(campaign.deadline);
            const isUrgent = daysLeft <= 3 && daysLeft >= 0 && campaign.status === 'active';
            
            return (
              <div
                key={campaign.id}
                onClick={() => onCampaignClick(campaign.id)}
                className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                  hover:scale-[1.02] hover:shadow-lg group
                  ${isUrgent 
                    ? 'bg-red-500/10 border-red-400/30 hover:border-red-400/50' 
                    : 'bg-white/5 border-white/10 hover:border-lime-400/30'
                  }`}
              >
                {/* Delete button for draft campaigns */}
                {campaign.status === 'draft' && (
                  <button
                    onClick={(e) => handleDeleteClick(e, campaign)}
                    disabled={deletingId === campaign.id}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200 text-red-400 hover:text-red-300
                      bg-red-400/10 hover:bg-red-400/20 p-1.5 rounded border border-red-400/30
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete campaign"
                  >
                    {deletingId === campaign.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-sm">🗑</span>
                    )}
                  </button>
                )}

                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs FontNoto font-semibold border ${getStatusColor(campaign.status)}`}>
                    <span>{getStatusIcon(campaign.status)}</span>
                    <span className="capitalize">{campaign.status}</span>
                  </div>
                  
                  {isUrgent && (
                    <div className="text-red-400 text-xs FontNoto font-semibold animate-pulse">
                      ⚠️ Urgent
                    </div>
                  )}
                </div>

                {/* Campaign title */}
                <h3 className="text-lg FontNoto font-semibold text-[#E0FFFA] mb-2 group-hover:text-lime-400 transition-colors duration-200">
                  {campaign.title}
                </h3>

                {/* Campaign stats */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-400 FontNoto">Applicants:</span>
                    <span className="text-lime-400 FontNoto font-semibold ml-2">
                      {campaign.applicants || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 FontNoto">Submissions:</span>
                    <span className="text-lime-400 FontNoto font-semibold ml-2">
                      {campaign.submissions || 0}
                    </span>
                  </div>
                </div>

                {/* Submission rate */}
                {campaign.applicants > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400 FontNoto">Submission Rate</span>
                      <span className="text-lime-400 FontNoto font-semibold">
                        {campaign.submissionRate || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-lime-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.submissionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Deadline */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 FontNoto">Deadline:</span>
                  <div className="text-right">
                    <div className="text-gray-300 FontNoto">{formatDate(campaign.deadline)}</div>
                    {campaign.status === 'active' && (
                      <div className={`FontNoto font-semibold ${
                        daysLeft < 0 ? 'text-red-400' : 
                        daysLeft <= 3 ? 'text-orange-400' : 
                        'text-lime-400'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                         daysLeft === 0 ? 'Due today' :
                         `${daysLeft} days left`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl FontNoto font-bold text-[#E0FFFA] mb-2">
                Delete Campaign
              </h3>
              <p className="text-gray-400 FontNoto mb-6">
                Are you sure you want to delete "{campaignToDelete?.title}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDeleteCancel}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg FontNoto
                    transition-colors duration-200 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === campaignToDelete?.id}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg FontNoto
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                >
                  {deletingId === campaignToDelete?.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Campaign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
