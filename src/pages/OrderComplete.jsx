/** @format */

import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, ArrowRight, Home } from "lucide-react";

const OrderComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  // If no order data, redirect to mall
  useEffect(() => {
    if (!orderData) {
      navigate("/mall");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const { orderId, product, total, shippingAddress } = orderData;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white FontNoto mb-4">
            Order Complete!
          </h1>
          
          <p className="text-xl text-gray-300 FontLato">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Info */}
            <div>
              <h2 className="text-2xl font-semibold text-white FontNoto mb-6">Order Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono">{orderId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-lime-400 font-bold text-xl">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Status:</span>
                  <span className="text-green-400 font-semibold">Paid</span>
                </div>
              </div>

              {/* Product Summary */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white FontNoto mb-4">Items Ordered</h3>
                <div className="bg-black/50 rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{product.name}</h4>
                      <p className="text-gray-400 text-sm">{product.brand}</p>
                      <p className="text-gray-400 text-sm">Size: {product.selectedVariant.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400 text-sm">Qty: {product.quantity}</span>
                        <span className="text-white font-semibold">
                          ${(product.selectedVariant.price * product.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-2xl font-semibold text-white FontNoto mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 block mb-1">Shipping Address:</span>
                  <div className="text-white">
                    <p>{shippingAddress.name}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 block mb-1">Estimated Delivery:</span>
                  <span className="text-white font-semibold">
                    {estimatedDelivery.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400 block mb-1">Shipping Method:</span>
                  <span className="text-white">Standard Shipping (5-7 business days)</span>
                </div>
              </div>

              {/* Tracking Notice */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Package className="text-blue-400 mt-1" size={20} />
                    <div>
                      <h4 className="text-blue-200 font-semibold mb-1">Tracking Information</h4>
                      <p className="text-blue-200 text-sm">
                        You will receive an email with tracking information once your order ships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Truck className="text-yellow-400 mt-1" size={24} />
            <div>
              <h3 className="text-yellow-200 font-semibold text-lg mb-2 FontNoto">
                Direct Brand Fulfillment
              </h3>
              <p className="text-yellow-200 FontLato">
                Your order will be shipped and handled directly by <strong>{product.brand}</strong>. 
                All shipping updates, tracking information, and customer support will come directly from the brand. 
                If you have any questions about your order, please contact {product.brand} customer service.
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white FontNoto mb-6">Order Status</h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-700"></div>
            <div className="absolute left-4 top-4 w-0.5 h-8 bg-lime-400"></div>
            
            <div className="space-y-6">
              {/* Current Step */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center relative z-10">
                  <CheckCircle size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-white font-semibold">Order Confirmed</p>
                  <p className="text-gray-400 text-sm">Your order has been received and confirmed</p>
                </div>
              </div>
              
              {/* Future Steps */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center relative z-10">
                  <Package size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Processing</p>
                  <p className="text-gray-500 text-sm">Your order is being prepared for shipment</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center relative z-10">
                  <Truck size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Shipped</p>
                  <p className="text-gray-500 text-sm">Your order is on its way</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center relative z-10">
                  <CheckCircle size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Delivered</p>
                  <p className="text-gray-500 text-sm">Your order has been delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mall"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-green-600 text-black font-bold py-3 px-8 rounded-lg text-lg FontNoto hover:from-lime-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105"
          >
            Continue Shopping
            <ArrowRight size={20} />
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg FontNoto hover:border-gray-500 transition-colors"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 FontLato">
            Need help with your order? Contact{" "}
            <span className="text-lime-400 font-semibold">{product.brand}</span> customer support
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;

