import React, { useState } from "react";
import {
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../../config";
import Cookie from "js-cookie";

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [shippingInfo, setShippingInfo] = useState({
    status: order?.status || "",
    trackingNumber: order?.tracking?.trackingNumber || "",
    carrier: order?.tracking?.carrier || "",
  });
  const [saving, setSaving] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "confirmed", label: "Confirmed", color: "text-blue-600" },
    { value: "processing", label: "Processing", color: "text-purple-600" },
    { value: "shipped", label: "Shipped", color: "text-indigo-600" },
    { value: "delivered", label: "Delivered", color: "text-green-600" },
    { value: "cancelled", label: "Cancelled", color: "text-red-600" },
    { value: "refunded", label: "Refunded", color: "text-gray-600" },
  ];

  const carrierOptions = [
    { value: "", label: "Select Carrier" },
    { value: "UPS", label: "UPS" },
    { value: "FedEx", label: "FedEx" },
    { value: "DHL", label: "DHL" },
    { value: "USPS", label: "USPS" },
    { value: "Canada Post", label: "Canada Post" },
    { value: "Other", label: "Other" },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = Cookie.get("AdminToken");

      const response = await axios.put(
        `${config.BACKEND_URL}/admin/mall/orders/${order._id}/shipping`,
        shippingInfo,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.status === "success") {
        toast.success("Shipping information updated successfully", {
          theme: "dark",
        });
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating shipping:", error);
      toast.error("Failed to update shipping information", { theme: "dark" });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (shipping) => {
    return `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}, ${shipping.country}`;
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Order Details: {order.orderId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-800 px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <UserIcon className="h-5 w-5 text-blue-400" />
                  <h4 className="text-lg font-medium text-white">
                    Customer Information
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white font-medium">
                      {order.customer.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{order.customer.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white">
                      {order.customer.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-5 w-5 text-green-400" />
                  <h4 className="text-lg font-medium text-white">
                    Shipping Address
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">
                      Full Address
                    </label>
                    <p className="text-white">
                      {formatAddress(order.shipping)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Shipping Method
                    </label>
                    <p className="text-white capitalize">
                      {order.shipping.method}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Shipping Cost
                    </label>
                    <p className="text-white">
                      ${order.shipping.cost?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="h-5 w-5 text-purple-400" />
                  <h4 className="text-lg font-medium text-white">
                    Order Summary
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Order Date</label>
                    <p className="text-white">{formatDate(order.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Payment Status
                    </label>
                    <p className="text-white capitalize">
                      {order.payment?.status || "pending"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">
                        ${order.subtotal?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping:</span>
                      <span className="text-white">
                        ${order.shippingCost?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white">
                        ${order.tax?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-green-400">
                          -${order.discount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-600 pt-2">
                      <span className="text-white">Total:</span>
                      <span className="text-white">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-5 w-5 text-indigo-400" />
                  <h4 className="text-lg font-medium text-white">
                    Shipping Information
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Shipping Status
                    </label>
                    <select
                      value={shippingInfo.status}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Carrier
                    </label>
                    <select
                      value={shippingInfo.carrier}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          carrier: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {carrierOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.trackingNumber}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          trackingNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter tracking number"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {order.tracking?.shippedAt && (
                    <div>
                      <label className="text-sm text-gray-400">
                        Shipped At
                      </label>
                      <p className="text-white">
                        {formatDate(order.tracking.shippedAt)}
                      </p>
                    </div>
                  )}

                  {order.tracking?.deliveredAt && (
                    <div>
                      <label className="text-sm text-gray-400">
                        Delivered At
                      </label>
                      <p className="text-white">
                        {formatDate(order.tracking.deliveredAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-4">
                Order Items
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="pb-3 text-gray-300 font-medium">
                        Product
                      </th>
                      <th className="pb-3 text-gray-300 font-medium">
                        Variant
                      </th>
                      <th className="pb-3 text-gray-300 font-medium">
                        Quantity
                      </th>
                      <th className="pb-3 text-gray-300 font-medium">Price</th>
                      <th className="pb-3 text-gray-300 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="py-3 text-white">
                          <div className="flex items-center gap-3">
                            {item.productId?.mainImage && (
                              <img
                                src={item.productId.mainImage}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-400">
                                SKU: {item.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-white">
                          {item.variant || "N/A"}
                        </td>
                        <td className="py-3 text-white">{item.quantity}</td>
                        <td className="py-3 text-white">
                          ${item.price?.toFixed(2)}
                        </td>
                        <td className="py-3 text-white font-medium">
                          ${item.total?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Affiliate Information */}
            {order.affiliate?.userId && (
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">
                  Affiliate Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Affiliate</label>
                    <p className="text-white">{order.affiliate.username}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Commission Rate
                    </label>
                    <p className="text-white">
                      {order.affiliate.commissionRate}%
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Commission Amount
                    </label>
                    <p className="text-white">
                      ${order.affiliate.commissionAmount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
