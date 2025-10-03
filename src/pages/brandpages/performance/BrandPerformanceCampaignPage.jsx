import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import config from '../../../config';

//Campaign Detail View Component
export const BrandPerformanceCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return;
     fetch(`${config.BACKEND_URL}/brand/performance/campaigns/${id}/performance`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('BRAND_TOKEN')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const performance = data.data || {};
        const formatted = Object.values(performance).map((item, index) => ({
          creator_name: item.creator_name || `Creator ${index + 1}`,
          creator_id: item.creator_id,
          content_url: item.content_url || '#',
          platform: item.platform || 'Unknown',
          views: item.views || 0,
          likes: item.likes || 0,
          comments: item.comments || 0,
          last_updated: item.last_updated || 'N/A'
        }));
        setPerformanceData(formatted);
      })
      .catch(err => console.error('Failed to load performance data:', err));
  }, [id]);

  const handleExportClick = () => {
    const csv = Papa.unparse(performanceData.map(item => ({
      'Creator Name': item.creator_name,
      'Platform': item.platform,
      'Views': item.views,
      'Likes': item.likes,
      'Comments': item.comments,
      'Engagement Rate': item.views > 0 ? `${((item.likes + item.comments) / item.views * 100).toFixed(2)}%` : '0.00%',
      'Last Updated': item.last_updated,
      'Content URL': item.content_url,
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campaign-performance-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScrape = (item) => {
    setLoading(true);
    fetch(`${config.BACKEND_URL}/brand/performance/campaigns/${id}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('BRAND_TOKEN')}`
      },
      body: JSON.stringify({
        creator_id: item.creator_id,
        content_url: item.content_url
      })
    })
      .then(res => res.json())
      .then(data => {
        alert('Scrape complete. Refreshing data.');
        setLoading(false);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        alert('Scrape failed.');
      });
  };

  return (
 <div className="p-6 max-w-7xl mx-auto">
  <h1 className="text-3xl font-bold mb-6 text-gray-100">Campaign Performance Detail</h1>

  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
    <button
      onClick={() => navigate('/brand/performance')}
      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
    >
      ← Back to Campaign Summary
    </button>

    <button
      onClick={handleExportClick}
      disabled={performanceData.length === 0}
      className={`px-4 py-2 rounded-lg transition ${
        performanceData.length === 0
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-500 text-white'
      }`}
    >
      Export as CSV
    </button>
  </div>

  {performanceData.length === 0 ? (
    <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-300">
      <p className="text-xl"> No content has been submitted by creators for this campaign yet.</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl p-6 shadow-xl hover:shadow-xl transition duration-300 border border-gray-800">
        <thead className="bg-gray-900 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left">Creator</th>
            <th className="px-4 py-3 text-left">Platform</th>
            <th className="px-4 py-3 text-left">Views</th>
            <th className="px-4 py-3 text-left">Likes</th>
            <th className="px-4 py-3 text-left">Comments</th>
            <th className="px-4 py-3 text-left">Engagement Rate</th>
            <th className="px-4 py-3 text-left">Last Updated</th>
           </tr>
        </thead>
        <tbody>
          {performanceData.map((item) => (
            <tr key={item.content_url} className="hover:bg-gray-800 transition">
              <td className="px-4 py-3">
                <a
                  href={item.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {item.creator_name}
                </a>
              </td>
              <td className="px-4 py-3 capitalize">{item.platform}</td>
              <td className="px-4 py-3">{item.views}</td>
              <td className="px-4 py-3">{item.likes}</td>
              <td className="px-4 py-3">{item.comments}</td>
              <td className="px-4 py-3">
                {item.views > 0
                  ? ((item.likes + item.comments) / item.views * 100).toFixed(2)
                  : '0.00'}
                %
              </td>
              <td className="px-4 py-3">{item.last_updated}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
};