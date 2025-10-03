import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandPlanManagement = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('brandPlanTab') || 'one-time';
  });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(new Set());
  const [showHistory, setShowHistory] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [plans, setPlans] = useState([]);

  const token = Cookies.get("AdminToken") || localStorage.getItem("token");

  // Save tab selection to localStorage
  useEffect(() => {
    localStorage.setItem('brandPlanTab', activeTab);
  }, [activeTab, plans]);

  // Fetch brands data
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.BACKEND_URL}/admin/brands/plans`, {
        headers: { Authorization: token },
      });
      setBrands(res.data.brands || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchPlan();
  }, []);

  // Handle plan changes
  const handlePlanChange = (brandId, field, value) => {
    setBrands(prev => prev.map(brand => 
      brand.id === brandId 
        ? { ...brand, [field]: value }
        : brand
    ));
  };

  // Save brand plan changes
const saveBrandPlan = async (brandId) => {
  setSaving(prev => new Set(prev).add(brandId));
  try {
    const brand = brands.find(b => b.id === brandId);
    const payload = {
      planType: activeTab,
      plan: brand.currentPlan,
      validityStart: brand.validityStart,
      validityEnd: brand.validityEnd,
      extraQuota: brand.extraQuota || 0,
      campaignLimit: brand.campaignLimit || 0,
      creatorLimit: brand.creatorLimit || 0,
    };

    await axios.post(`${config.BACKEND_URL}/admin/brands/${brandId}/plan`, payload, {
      headers: { Authorization: token },
    });

    // ✅ Reset extraQuota to 0 after saving if in one-time tab
    if (activeTab === 'one-time') {
      setBrands(prev =>
        prev.map(b =>
          b.id === brandId ? { ...b, extraQuota:0 } : b
        )
      );
    }
    
    toast.success('Changes saved successfully!');
  } catch (err) {
    console.error('Error saving plan:', err);
    toast.error('Failed to save changes. Please try again.');
  } finally {
    setSaving(prev => {
      const newSet = new Set(prev);
      newSet.delete(brandId);
      return newSet;
    });
  }
};


  const fetchPlan = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/brand/package/plans`, {
        headers: { Authorization: token },
      });
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error('Error fetching plan history:', err);
    }
  };


  // Fetch plan history
  const fetchPlanHistory = async (brandId) => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/admin/brands/${brandId}/plan-history`, {
        headers: { Authorization: token },
      });
      setPlanHistory(res.data.history || []);
      setShowHistory(brandId);
    } catch (err) {
      console.error('Error fetching plan history:', err);
    }
  };



  const TabButton = ({ tab, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
        isActive
          ? 'bg-[#2a2a2a] text-white border-b-2 border-lime-400'
          : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#121212] text-gray-200">
      <Helmet>
        <title>Brand Plan Management | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Brand Plan Management</h1>
          <p className="text-gray-400">Manage subscription plans and campaign privileges for brands</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex border-b gap-3 border-gray-700">
            <TabButton
              tab="one-time"
              label="Gifted Campaign Plans"
              isActive={activeTab === 'one-time'}
              onClick={() => setActiveTab('one-time')}
            />
            <TabButton
              tab="subscription"
              label="Paid Campaign Plans"
              isActive={activeTab === 'subscription'}
              onClick={() => setActiveTab('subscription')}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading brands...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {activeTab === 'one-time' ? 'Current Plan' : 'Current subscription Plan'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {activeTab === 'one-time' ? 'Change Plan' : 'Change subscription Plan'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {activeTab === 'one-time' ? 'Current Validity' : 'subscription Plan Validity'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Set Validity
                    </th>
                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                          Campaign Limit
                        </th>
                    {activeTab === 'one-time' ? (
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                        Extra Recruit Quota
                      </th>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                          Creator Limit
                        </th>
                      </>
                    )}
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {brands.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'one-time' ? 7 : 8} className="px-6 py-8 text-center text-gray-400">
                        No brands found
                      </td>
                    </tr>
                  ) : (
                    brands.map((brand) => (
                      <BrandRow
                        key={brand.id}
                        plans={plans}
                        brand={brand}
                        activeTab={activeTab}
                        onPlanChange={handlePlanChange}
                        onSave={saveBrandPlan}
                        onShowHistory={fetchPlanHistory}
                        isSaving={saving.has(brand.id)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Plan History Modal */}
      {showHistory && (
        <PlanHistoryModal
          brandId={showHistory}
          history={planHistory}
          onClose={() => setShowHistory(null)}
        />
      )}
    </div>
  );
};

// Brand Row Component
const BrandRow = ({ plans,brand, activeTab, onPlanChange, onSave, onShowHistory, isSaving }) => {
  const planOptions = activeTab === 'one-time'
    ?  plans.filter((e) => e.planType=="one-time").map((e) => e)
    :  plans.filter((e) => e.planType=="subscription").map((e) => e)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <tr className="hover:bg-[#2a2a2a] transition-colors">
      {/* Brand Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-white">{brand.name}</div>
      </td>

      {/* Current Plan */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {brand.currentPlan || 'No Plan'}
        </span>
      </td>

      {/* Change Plan Dropdown */}
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={brand.currentPlan || ''}
          onChange={(e) => {
            const selectedPlan = e.target.value;
            // If switching from Free Trial to any other plan, end Free Trial status
            if (brand.currentPlan === 'Free Trial' && selectedPlan !== 'Free Trial') {
              onPlanChange(brand.id, 'isFreeTrial', false); // or whatever field ends free trial
            }
            onPlanChange(brand.id, 'currentPlan', selectedPlan);
          }}
          className="bg-[#333] border border-[#444] rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
        >
          <option value="">Select Plan</option>
          {/* Show Free Trial only if brand has no plan or current plan is Free Trial */}
          {(brand.currentPlan === 'Free Trial' || !brand.currentPlan) && (
            <option value="Free Trial">Free Trial</option>
          )}
          {planOptions
            .filter(plan => plan.name !== 'Free Trial')
            .map(plan => (
              <option key={plan.name} value={plan.name}>{plan.name}</option>
            ))}
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {brand.validityStart && brand.validityEnd
          ? `${formatDate(brand.validityStart)} ~ ${formatDate(brand.validityEnd)}`
          : 'Not set'
        }
      </td>

      {/* Set Validity */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          <input
            type="date"
            value={formatDate(brand.validityStart)}
            onChange={(e) => onPlanChange(brand.id, 'validityStart', e.target.value)}
            className="bg-[#333] border border-[#444] rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
          <span className="text-gray-400 self-center">to</span>
          <input
            type="date"
            value={formatDate(brand.validityEnd)}
            onChange={(e) => onPlanChange(brand.id, 'validityEnd', e.target.value)}
            className="bg-[#333] border border-[#444] rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>
      </td>


   {/* Campaign Limit */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm">
              <div className="text-gray-400">Default: {brand.defaultCampaignLimit || 0}</div>
              <input
                type="number"
                min="0"
                value={brand.campaignLimit || 0}
                onChange={(e) => onPlanChange(brand.id, 'campaignLimit', parseInt(e.target.value) || 0)}
                className="bg-[#333] border border-[#444] rounded px-2 py-1 text-white w-16 mt-1 focus:outline-none focus:ring-1 focus:ring-lime-400"
                placeholder="0"
              />
              <span className="text-gray-400 ml-1">extra</span>
            </div>
          </td>

      {/* Conditional columns based on tab */}
      {activeTab === 'one-time' ? (
        /* Extra Recruit Quota */
        <td className="px-6 py-4 whitespace-nowrap">
          <input
  type="text"
  inputMode="numeric"
  value={brand.extraQuota === 0 || brand.extraQuota === '' ? '' : brand.extraQuota}
  onChange={(e) => {
    let val = e.target.value;
    val = val.replace(/\D/g, ''); // remove non-digits
    if (val.length > 1) val = val.replace(/^0+/, ''); // remove leading zeros
    onPlanChange(brand.id, 'extraQuota', val === '' ? '' : parseInt(val, 10));
  }}
  className="bg-[#333] border border-[#444] rounded px-3 py-2 text-white w-20 focus:outline-none focus:ring-1 focus:ring-lime-400"
  placeholder="0"
/>

        </td>
        
      ) : (
        <>
          {/* Creator Limit */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm">
              <div className="text-gray-400">Default: {brand.defaultCreatorLimit || 0}</div>
              <input
                type="number"
                min="0"
                value={brand.creatorLimit || 0}
                onChange={(e) => onPlanChange(brand.id, 'creatorLimit', parseInt(e.target.value) || 0)}
                className="bg-[#333] border border-[#444] rounded px-2 py-1 text-white w-16 mt-1 focus:outline-none focus:ring-1 focus:ring-lime-400"
                placeholder="0"
              />
              <span className="text-gray-400 ml-1">extra</span>
            </div>
          </td>
        </>
      )}

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onSave(brand.id)}
            disabled={isSaving}
            className="bg-lime-600 hover:bg-lime-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => onShowHistory(brand.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            History
          </button>
        </div>
      </td>
    </tr>
  );
};

// Plan History Modal Component
const PlanHistoryModal = ({ brandId, history, onClose }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Plan History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No plan history found for this brand.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={index} className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 font-medium">🔹 {formatDate(entry.date)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-white">
                        {entry.oldPlan ? `${entry.oldPlan} → ${entry.newPlan}` : `Plan set to ${entry.newPlan}`}
                      </span>
                    </div>

                    {entry.validityPeriod && (
                      <div className="text-sm text-gray-300 mb-1">
                        Validity: {entry.validityPeriod}
                      </div>
                    )}

                    {entry.extraQuota !== undefined && (
                      <div className="text-sm text-gray-300 mb-1">
                        Extra Quota: {entry.oldExtraQuota || 0} → {entry.extraQuota}
                      </div>
                    )}

                    {entry.campaignLimit !== undefined && (
                      <div className="text-sm text-gray-300 mb-1">
                        Campaign Limit: {entry.oldCampaignLimit || 0} → {entry.campaignLimit} (extra)
                      </div>
                    )}

                    {entry.creatorLimit !== undefined && (
                      <div className="text-sm text-gray-300 mb-1">
                        Creator Limit: {entry.oldCreatorLimit || 0} → {entry.creatorLimit} (extra)
                      </div>
                    )}

                    {entry.adminUser && (
                      <div className="text-xs text-gray-400 mt-2">
                        Changed by: {entry.adminUser}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandPlanManagement;
