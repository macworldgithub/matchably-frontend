import React, { useState, useMemo, useEffect } from "react";
import CreatorCard from "./CreatorCard";
import RecommendedCard from "./RecommendedCardList";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { handleParticipationAction } from "../../../utils/handleParticipation";
import axios from "axios";
import config from "../../../config";

const PAGE_SIZE = 9;

const CreatorCardList = ({
  creators,
  campaign,
  onRefresh,
  onhandleViewContent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const onStatusChange = "";

  const [recommendedCreators, setRecommendedCreators] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  // Fetch live recommended creators
  useEffect(() => {
    if (statusFilter === "Recommended" && campaign?._id) {
      setLoadingRecommended(true);
      axios
        .get(
          `${config.BACKEND_URL}/recommendations?campaignId=${campaign._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("BRAND_TOKEN")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            setRecommendedCreators(res.data.data);
          } else {
            toast.error("Failed to fetch recommended creators");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Server error while fetching recommendations");
        })
        .finally(() => setLoadingRecommended(false));
    }
  }, [statusFilter, campaign]);
  const filteredCreators = useMemo(() => {
    if (!Array.isArray(creators)) return [];

    return creators.filter((creator) => {
      const matchesStatus =
        statusFilter === "All" || creator.participationStatus === statusFilter;

      const matchesSearch =
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.socialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [creators, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredCreators.length / PAGE_SIZE);

  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", "creators"); // or dynamic if needed
    params.set("filter", statusFilter);
    params.set("search", searchQuery);
    params.set("page", currentPage);

    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
      },
      { replace: true }
    ); // `replace: true` prevents pushing to browser history stack
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", "creators");
    const filter = params.get("filter");
    const search = params.get("search");
    const page = parseInt(params.get("page") || "1");

    if (filter) setStatusFilter(filter);
    if (search) setSearchQuery(search);
    if (!isNaN(page)) setCurrentPage(page);
  }, []);

  const handleApproveOrReject = async (creatorId, action) => {
    const response = await handleParticipationAction(creatorId, action);
    if (response.success) {
      toast.success(response.message);
      onRefresh();
    } else {
      toast.error(response.message);
    }
  };

  const handleViewContent = (creator) => {
    onhandleViewContent(creator);
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Social ID",
      "Status",
      "Phone Number",
      "Email",
      "Address",
      "Content Status",
      "Delivery Status",
      "Tracking Number",
      "Content Deadline",
    ];

    const rows = filteredCreators.map((c) => [
      c.name,
      c.socialId,
      c.participationStatus,
      c.shippingInfo?.phone || "",
      c.shippingInfo?.email || "",
      c.shippingInfo?.address || "",
      c.contentStatus || "",
      c.tracking_info?.delivery_status || "",
      c.tracking_info?.tracking_number || "",
      c.contentDeadline || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      String(campaign.campaignTitle).replace(/[^a-zA-Z0-9]/g, "") +
      "_creators_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInvite = (creator) => {
    // Example: show a toast or trigger API call
    console.log("Inviting creator:", creator.socialId);
    toast.success(`Invite sent to ${creator.socialId}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
          "Recommended"
        ].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);

              setCurrentPage(1);
            }}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }`}
          >
            {status}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="ml-auto px-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-600 text-sm w-full sm:w-64"
        />

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Recommended Section */}
      {statusFilter === "Recommended" ? (
        <div className="space-y-4">
          {loadingRecommended ? (
            <p className="text-center text-gray-400">
              Loading recommendations...
            </p>
          ) : recommendedCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCreators.map((creator) => (
                <RecommendedCard
                  key={creator.creatorId || creator._id}
                  creator={creator}
                  campaignId={campaign._id}
                  onInvite={handleInvite}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No AI recommended creators found.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Creator Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCreators.length > 0 ? (
              paginatedCreators.map((creator, index) => (
                <div
                  key={creator.id}
                  className={
                    creator.isLocked
                      ? "opacity-50 pointer-events-none grayscale"
                      : ""
                  }
                >
                  <CreatorCard
                    creator={creator}
                    onHandleApproveOrReject={handleApproveOrReject}
                    onViewContent={handleViewContent}
                    onRefresh={onRefresh}
                    isLocked={creator.isLocked} // pass to child if needed
                  />
                </div>
              ))
            ) : (
              <p className="text-neutral-400 col-span-full text-center py-8">
                No creators match your search/filter.
              </p>
            )}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-neutral-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatorCardList;
