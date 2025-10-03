import { Routes, Route, useParams } from "react-router-dom";
import BrandDashboard from "../pages/brandpages/BrandDashboard";
import Pricing from "../components/PricingPlans";
import PaymentSuccess from "../components/brand/PaymentSuccess"; // ✅ import
import BrandHistory from "../components/brand/BrandHistory";
import BrandCampaign from "../components/brand/BrandCampaign";
import BrandApplication from "../components/brand/BrandApplication";
import BrandCampaignSubmission from "../components/brand/BrandCampaignSubmission"; // ✅ import
import BrandSettings from "../pages/brandpages/BrandSettings"; // ✅ import if needed
import ActivePlan from "./brandpages/ActivePlan";
import BrandTasks from "./brandpages/BrandTasks"; // ✅ import if needed
import BrandCampaignDetail from "./brandpages/BrandCampaignDetail";
import BrandPerformancePage from "./brandpages/performance/BrandPerformancePage";
import { BrandPerformanceCampaignPage } from "./brandpages/performance/BrandPerformanceCampaignPage";
import BlockedCreators from "./brandpages/BlockedCreators";

export default function BrandRoutes() {
  // const { campaignId } = useParams();

  return (
    <Routes>
      <Route path="dashboard" element={<BrandDashboard />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="payment-success" element={<PaymentSuccess />} />{" "}
      {/* ✅ ADD THIS */}
      <Route path="payment-history" element={<BrandHistory />} />
      <Route path="create-campaign" element={<BrandCampaign />} />
      <Route
        path="brand-applications/:campaignId"
        element={<BrandApplication />}
      />
      <Route
        path="campaign-submission/:campaignId/:email"
        element={<BrandCampaignSubmission />}
      />
      <Route path="activeplan" element={<ActivePlan />} />
      <Route path="brand-settings" element={<BrandSettings />} />
      <Route path="tasks" element={<BrandTasks />} />
      <Route path="campaigns/:id" element={<BrandCampaignDetail />} />
      <Route path="campaigns/:id/content" element={<BrandCampaignDetail />} />
       <Route path="performance" element={<BrandPerformancePage />} />
       <Route path="campaigns/:id/performance" element={<BrandPerformanceCampaignPage />} />
      <Route path="blocked-creators" element={<BlockedCreators />} />
    </Routes>
  );
}


// 📊 Campaign Detail View Component
export const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/brand/performance/bulk/${id}`, {
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
    fetch('/api/brand/performance/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('BRAND_TOKEN')}`
      },
      body: JSON.stringify({
        campaign_id: id,
        creator_id: item.creator_id,
        content_url: item.content_url
      })
    })
      .then(res => res.json())
      .then(data => {
        alert('Scrape complete. Refreshing data.');
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        alert('Scrape failed.');
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Campaign Performance Detail</h1>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/brand/performance')} className="px-4 py-2 bg-gray-300 rounded">
          ← Back to Campaign Summary
        </button>
        <button
          onClick={handleExportClick}
          disabled={performanceData.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          📄 Export as CSV
        </button>
      </div>

      {performanceData.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-xl">📭 No content has been submitted by creators for this campaign yet.</p>
        </div>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Creator</th>
              <th className="border px-4 py-2">Platform</th>
              <th className="border px-4 py-2">Views</th>
              <th className="border px-4 py-2">Likes</th>
              <th className="border px-4 py-2">Comments</th>
              <th className="border px-4 py-2">Engagement Rate</th>
              <th className="border px-4 py-2">Last Updated</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((item) => (
              <tr key={item.content_url}>
                <td className="border px-4 py-2">
                  <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                    {item.creator_name}
                  </a>
                </td>
                <td className="border px-4 py-2">{item.platform}</td>
                <td className="border px-4 py-2">{item.views}</td>
                <td className="border px-4 py-2">{item.likes}</td>
                <td className="border px-4 py-2">{item.comments}</td>
                <td className="border px-4 py-2">
                  {item.views > 0 ? ((item.likes + item.comments) / item.views * 100).toFixed(2) : '0.00'}%
                </td>
                <td className="border px-4 py-2">{item.last_updated}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleScrape(item)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Scrape Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};