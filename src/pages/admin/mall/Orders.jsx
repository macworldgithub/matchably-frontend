import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../../config";
import Cookie from "js-cookie";
import OrderDetailsModal from "../../../components/admin/mall/OrderDetailsModal";

const Orders = () => {
  const [brandGroups, setBrandGroups] = useState([]);
  const [expandedBrands, setExpandedBrands] = useState(new Set());
  const [brandOrders, setBrandOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: "all",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  // Fetch brand groups
  const fetchBrandGroups = async () => {
    try {
      setLoading(true);
      const token = Cookie.get("AdminToken");
      console.log("AdminToken:", token ? "Found" : "Missing");

      if (!token) {
        toast.error("Admin authentication required. Please log in.", {
          theme: "dark",
        });
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });

      const response = await axios.get(
        `${config.BACKEND_URL}/admin/mall/orders?${params.toString()}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status === "success") {
        setBrandGroups(response.data.data.brandGroups);
      }
    } catch (error) {
      console.error("Error fetching brand groups:", error);
      toast.error("Failed to fetch orders", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed orders for a brand
  const fetchBrandOrders = async (brandName) => {
    try {
      const token = Cookie.get("AdminToken");
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && key !== "brand") {
          params.append(key, value);
        }
      });

      const response = await axios.get(
        `${config.BACKEND_URL}/admin/mall/orders/brand/${encodeURIComponent(
          brandName
        )}?${params.toString()}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status === "success") {
        setBrandOrders((prev) => ({
          ...prev,
          [brandName]: response.data.data.orders,
        }));
      }
    } catch (error) {
      console.error("Error fetching brand orders:", error);
      toast.error("Failed to fetch brand orders", { theme: "dark" });
    }
  };

  // Toggle brand expansion
  const toggleBrandExpansion = async (brandName) => {
    const newExpanded = new Set(expandedBrands);

    if (newExpanded.has(brandName)) {
      newExpanded.delete(brandName);
    } else {
      newExpanded.add(brandName);
      // Fetch orders for this brand if not already loaded
      if (!brandOrders[brandName]) {
        await fetchBrandOrders(brandName);
      }
    }

    setExpandedBrands(newExpanded);
  };

  // Export orders for a brand
  const exportBrandOrders = async (brandName) => {
    try {
      const token = Cookie.get("AdminToken");
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && key !== "brand") {
          params.append(key, value);
        }
      });

      const response = await axios.get(
        `${config.BACKEND_URL}/admin/mall/orders/export/${encodeURIComponent(
          brandName
        )}?${params.toString()}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status === "success") {
        // Convert to CSV and download
        const csvData = response.data.data;
        const csvContent = convertToCSV(csvData);
        downloadCSV(csvContent, `${brandName}_orders.csv`);
        toast.success("Orders exported successfully", { theme: "dark" });
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders", { theme: "dark" });
    }
  };

  // Convert data to CSV
  const convertToCSV = (data) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(",");
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

  // Download CSV file
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      const token = Cookie.get("AdminToken");
      const response = await axios.get(
        `${config.BACKEND_URL}/admin/mall/orders/${orderId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status === "success") {
        setSelectedOrder(response.data.data.order);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details", { theme: "dark" });
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setExpandedBrands(new Set());
    setBrandOrders({});
    fetchBrandGroups();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      brand: "all",
      status: "all",
      startDate: "",
      endDate: "",
    });
    setExpandedBrands(new Set());
    setBrandOrders({});
  };

  useEffect(() => {
    fetchBrandGroups();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mall Orders</h1>
          <p className="text-gray-400">Manage and fulfill orders by brand</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-white font-medium">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Brands</option>
                {brandGroups.map((group) => (
                  <option key={group.brandName} value={group.brandName}>
                    {group.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Brand Groups */}
        {!loading && (
          <div className="space-y-4">
            {brandGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              brandGroups.map((group) => (
                <div
                  key={group.brandName}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  {/* Brand Summary (Collapsed View) */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Brand Info */}
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-1">
                              {group.brandName}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Campaign: Summer Launch Campaign
                            </p>
                          </div>

                          {/* Order Stats */}
                          <div>
                            <p className="text-gray-400 text-sm">Orders</p>
                            <p className="text-white font-medium">
                              {group.totalOrders} |
                              <span className="text-green-400 ml-1">
                                Fulfilled: {group.fulfilledOrders}
                              </span>{" "}
                              |
                              <span className="text-yellow-400 ml-1">
                                Unfulfilled: {group.unfulfilledOrders}
                              </span>
                            </p>
                          </div>

                          {/* Total Sales */}
                          <div>
                            <p className="text-gray-400 text-sm">Total Sales</p>
                            <p className="text-white font-medium text-lg">
                              ${group.totalSales?.toFixed(2) || "0.00"}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                toggleBrandExpansion(group.brandName)
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              {expandedBrands.has(group.brandName) ? (
                                <>
                                  <ChevronUpIcon className="h-4 w-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="h-4 w-4" />
                                  View Details
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => exportBrandOrders(group.brandName)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                              Export Orders
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Orders Table */}
                  {expandedBrands.has(group.brandName) && (
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="pb-3 text-gray-300 font-medium">
                                Order ID
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Customer
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Product(s)
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Qty
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Total
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Status
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Tracking
                              </th>
                              <th className="pb-3 text-gray-300 font-medium">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {brandOrders[group.brandName]?.map((order) => (
                              <tr
                                key={order._id}
                                className="border-b border-gray-700"
                              >
                                <td className="py-4 text-white font-mono text-sm">
                                  {order.orderId}
                                </td>
                                <td className="py-4 text-white">
                                  {order.customer.name}
                                </td>
                                <td className="py-4 text-white">
                                  {order.items
                                    .map((item) => item.name)
                                    .join(", ")}
                                </td>
                                <td className="py-4 text-white">
                                  {order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}
                                </td>
                                <td className="py-4 text-white font-medium">
                                  ${order.total.toFixed(2)}
                                </td>
                                <td className="py-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      statusColors[order.status] ||
                                      "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-4 text-white text-sm">
                                  {order.tracking?.trackingNumber || "-"}
                                </td>
                                <td className="py-4">
                                  <button
                                    onClick={() => viewOrderDetails(order._id)}
                                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {brandOrders[group.brandName]?.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-400">
                              No orders found for this brand
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={showOrderModal}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
            onUpdate={() => {
              // Refresh the current view
              fetchBrandGroups();
              // Refresh expanded brand orders
              expandedBrands.forEach((brandName) => {
                fetchBrandOrders(brandName);
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
