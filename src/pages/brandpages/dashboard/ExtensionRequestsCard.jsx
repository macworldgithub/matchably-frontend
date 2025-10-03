import React, { useState, useEffect } from "react";
import config from "../../../config";

const ExtensionRequestsCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExtensionRequests();
  }, []);

  const fetchExtensionRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch extension requests data
      const response = await fetch(`${config.BACKEND_URL}/brand/campaigns/extension-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("Extension requests data", responseData);
      
      // Assuming the API returns an array of requests
      // Adjust this based on your actual API response structure
      const requestsData = responseData.data || responseData.requests || responseData || [];
      
      setRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error('Error fetching extension requests:', err);
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-[#1f1f1f] border border-[#2c2c2c] p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-white mb-2">
          🕐 Pending Extension Requests
        </h2>
        <div className="text-gray-400 text-center py-4">
          Loading extension requests...
        </div>
      </div>
    );
  }

  // Show error state or no requests found
  if (error || !requests.length) {
    return (
      <div className="bg-[#1f1f1f] border border-[#2c2c2c] p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-white mb-2">
          🕐 Pending Extension Requests
        </h2>
        <div className="text-gray-400 text-center py-4">
          {error ? (
            <>
              <div className="text-red-400 mb-2">Error loading requests</div>
              {/* <div className="text-sm">{error}</div> */}
            </>
          ) : (
            "No extension requests found"
          )}
        </div>
      </div>
    );
  }

  // Show requests
  return (
    <div className="bg-[#1f1f1f] border border-[#2c2c2c] p-5 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-white mb-2">
        🕐 Pending Extension Requests
      </h2>

      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-[#2b2b2b] p-4 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
        >
          <div className="text-gray-300 text-sm">
            <strong className="text-white">{req.creatorName}</strong> |{" "}
            {req.campaignTitle} → <span className="text-yellow-400">+{req.daysRequested} days</span>{" "}
            | Reason: {req.reason}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExtensionRequestsCard;