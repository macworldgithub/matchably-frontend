/** @format */

import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield, Lock } from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state;

  // If no product data, redirect to mall
  if (!checkoutData || !checkoutData.product) {
    navigate("/mall");
    return null;
  }

  const { product } = checkoutData;
  const total = product.selectedVariant.price * product.quantity;
  const shipping = 5.99;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shipping + tax;

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      "email", "firstName", "lastName", "address", "city", "state", "zipCode", "phone"
    ];

    if (formData.paymentMethod === "card") {
      requiredFields.push("cardNumber", "expiryDate", "cvv", "nameOnCard");
    }

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Card number validation (basic)
    if (formData.paymentMethod === "card" && formData.cardNumber) {
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      if (cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber)) {
        newErrors.cardNumber = "Please enter a valid card number";
      }
    }

    // Expiry date validation
    if (formData.paymentMethod === "card" && formData.expiryDate) {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      }
    }

    // CVV validation
    if (formData.paymentMethod === "card" && formData.cvv) {
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order ID and navigate to success page
    const orderId = `MBL-${Date.now()}`;
    navigate("/order/complete", {
      state: {
        orderId,
        product,
        total: finalTotal,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      },
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to={`/product/${product.id}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            Back to Product
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white FontNoto mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white FontNoto mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                        errors.email ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.firstName ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.lastName ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                        errors.phone ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white FontNoto mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                        errors.address ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.city ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.state ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="NY"
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.zipCode ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white FontNoto mb-4">Payment Method</h2>
                
                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="text-lime-400"
                    />
                    <CreditCard size={20} className="text-gray-400" />
                    <span className="text-white">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="text-lime-400"
                    />
                    <div className="w-5 h-5 bg-blue-500 rounded text-xs flex items-center justify-center text-white font-bold">P</div>
                    <span className="text-white">PayPal</span>
                  </label>
                </div>

                {/* Card Details */}
                {formData.paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name on Card</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.nameOnCard ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.nameOnCard && <p className="text-red-400 text-sm mt-1">{errors.nameOnCard}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="19"
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                          errors.cardNumber ? "border-red-500" : "border-gray-600"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          maxLength="5"
                          className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                            errors.expiryDate ? "border-red-500" : "border-gray-600"
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength="4"
                          className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-lime-400 transition-colors ${
                            errors.cvv ? "border-red-500" : "border-gray-600"
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "paypal" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-black font-bold py-4 rounded-lg text-lg FontNoto hover:from-lime-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-lime-400/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - $${finalTotal.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-white FontNoto mb-4">Order Summary</h2>
              
              {/* Product */}
              <div className="border-b border-gray-700 pb-4 mb-4">
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.brand}</p>
                    <p className="text-gray-400 text-sm">Size: {product.selectedVariant.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {product.quantity}</p>
                  </div>
                  <div className="text-white font-semibold">
                    ${(product.selectedVariant.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mt-6">
                <div className="flex items-center gap-2 text-green-200">
                  <Lock size={16} />
                  <span className="text-sm font-semibold">Secure Checkout</span>
                </div>
                <p className="text-green-200 text-xs mt-1">
                  Your payment information is encrypted and secure.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 text-gray-300">
                  <Truck size={16} />
                  <span className="text-xs">Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Shield size={16} />
                  <span className="text-xs">Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

