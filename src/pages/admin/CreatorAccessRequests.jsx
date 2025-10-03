import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import config from "../../config";
import Cookie from "js-cookie";
import Tiktok from "/assets/tiktok-brands-solid.svg";
import Instgarm from "/assets/instagram-brands.svg"; // Assuming you have an Instagram icon

const CreatorAccessRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [followerCounts, setFollowerCounts] = useState({});

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = Cookie.get("AdminToken");
            console.log(config.BACKEND_URL);
            const res = await axios.get(`${config.BACKEND_URL}/admin/car`, {
                headers: { authorization: token },
            });

            console.log(res.data);
            if (res.data.status === "success") {
                setRequests(res.data.applications || res.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        const followerCount = followerCounts[requestId];
        if (!followerCount || followerCount <= 0) {
            toast.error("Please enter a valid follower count");
            return;
        }

        setApprovingId(requestId);
        try {
            const token = Cookie.get("AdminToken");
            const res = await axios.put(
                `${config.BACKEND_URL}/admin/car/${requestId}/approve`,
                { followerCount: parseInt(followerCount) },
                { headers: { authorization: token } }
            );

            if (res.data.status === "success") {
                toast.success("Request approved successfully");
                await fetchRequests();
                setFollowerCounts((prev) => {
                    const newCounts = { ...prev };
                    delete newCounts[requestId];
                    return newCounts;
                });
            }
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Failed to approve request");
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setRejectingId(selectedRequest.id);
        try {
            const token = Cookie.get("AdminToken");
            const res = await axios.put(
                `${config.BACKEND_URL}/admin/car/${selectedRequest.id}/reject`,
                { reason: rejectReason.trim() },
                { headers: { authorization: token } }
            );

            if (res.data.status === "success") {
                toast.success("Request rejected successfully");
                await fetchRequests();
                setShowRejectModal(false);
                setRejectReason("");
                setSelectedRequest(null);
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Failed to reject request");
        } finally {
            setRejectingId(null);
        }
    };

    const openRejectModal = (request) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
    };

    const getPlatformIcon = (platform) => {
        if (platform === "TikTok") {
            return (
                <img
                    src={Tiktok}
                    alt="TikTok"
                    width={20}
                    style={{ filter: "invert(1)", mixBlendMode: "difference" }}
                />
            );
        } else if (platform === "Instagram") {
            return (
                <img
                    src={Instgarm}
                    alt="Instgarm"
                    width={20}
                    style={{ filter: "invert(1)", mixBlendMode: "difference" }}
                />
            );
        }
        return "📱";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <Helmet>
                <title>Creator Access Requests | Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Creator Access Requests
                    </h1>
                    <div className="text-sm text-gray-400">
                        {requests?.length || 0} pending request
                        {(requests?.length || 0) !== 1 ? "s" : ""}
                    </div>
                </div>

                {!requests || requests.length === 0 ? (
                    <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
                        <div className="text-4xl mb-4">🎉</div>
                        <h2 className="text-xl font-semibold mb-2">
                            No Pending Requests
                        </h2>
                        <p className="text-gray-400">
                            All creator access requests have been processed.
                        </p>
                    </div>
                ) : (
                    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#2a2a2a]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Creator
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Platform
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Gifted Campaigns
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Followers
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Request Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2a2a2a]">
                                    {requests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-[#252525] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium">
                                                        {request.creatorName}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {request.creatorEmail}
                                                    </div>
                                                    <a
                                                        href={
                                                            request.socialLink
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                                                    >
                                                        View {request.platform}
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">
                                                        {getPlatformIcon(
                                                            request.platform
                                                        )}
                                                    </span>
                                                    <span>
                                                        {request.platform}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                                                    {
                                                        request.giftedCampaignsSubmitted
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    placeholder="Enter count"
                                                    value={
                                                        followerCounts[
                                                            request.id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setFollowerCounts(
                                                            (prev) => ({
                                                                ...prev,
                                                                [request.id]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="bg-[#333] border border-[#555] rounded px-3 py-1 text-white w-24 text-sm"
                                                    min="1"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {formatDate(
                                                    request.requestDate
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                request.id
                                                            )
                                                        }
                                                        disabled={
                                                            approvingId ===
                                                                request.id ||
                                                            !followerCounts[
                                                                request.id
                                                            ]
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                    >
                                                        {approvingId ===
                                                        request.id ? (
                                                            <>
                                                                <svg
                                                                    className="animate-spin h-3 w-3"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="none"
                                                                        d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4m15 0h4m-3.78-7.78l-2.83 2.83M7.05 16.95l-2.83 2.83"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                    />
                                                                </svg>
                                                                Approving...
                                                            </>
                                                        ) : (
                                                            <>Approve</>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openRejectModal(
                                                                request
                                                            )
                                                        }
                                                        disabled={
                                                            rejectingId ===
                                                            request.id
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            Reject Access Request
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Please provide a reason for rejecting{" "}
                            {selectedRequest?.creatorName}'s request:
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full bg-[#333] border border-[#555] rounded px-3 py-2 text-white mb-4 h-24 resize-none"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason("");
                                    setSelectedRequest(null);
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={rejectingId === selectedRequest?.id}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                {rejectingId === selectedRequest?.id
                                    ? "Rejecting..."
                                    : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorAccessRequests;
