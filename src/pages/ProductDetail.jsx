/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Mock product data - in real app this would be fetched by ID
  const product = {
    id: parseInt(id),
    name: "Hydrating Serum",
    brand: "K-Beauty Co",
    price: 24.99,
    originalPrice: 29.99,
    description: "A powerful hydrating serum infused with hyaluronic acid and vitamin E. This lightweight formula penetrates deep into the skin to provide lasting moisture and improve skin texture. Perfect for all skin types, including sensitive skin.",
    images: [
      "/assets/logo_matchably.png", // placeholder images
      "/assets/logo_matchably.png",
      "/assets/logo_matchably.png",
      "/assets/logo_matchably.png",
    ],
    category: "skincare",
    rating: 4.8,
    reviews: 234,
    isOnSale: true,
    inStock: true,
    stockCount: 15,
    variants: [
      { name: "30ml", price: 24.99, originalPrice: 29.99 },
      { name: "50ml", price: 38.99, originalPrice: 44.99 },
      { name: "100ml", price: 68.99, originalPrice: 79.99 },
    ],
    features: [
      "Hyaluronic Acid",
      "Vitamin E",
      "Paraben-free",
      "Cruelty-free",
      "Made in Korea",
    ],
    ingredients: "Water, Hyaluronic Acid, Vitamin E, Glycerin, Panthenol, Allantoin, Sodium Hyaluronate",
    howToUse: "Apply 2-3 drops to clean face morning and evening. Gently pat into skin until absorbed. Follow with moisturizer.",
  };

  const mockReviews = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      comment: "Amazing product! My skin feels so much more hydrated and looks glowing.",
      verified: true,
    },
    {
      id: 2,
      name: "Jessica L.",
      rating: 4,
      date: "2024-01-10",
      comment: "Good serum, absorbs well. Would recommend for dry skin types.",
      verified: true,
    },
    {
      id: 3,
      name: "Maria C.",
      rating: 5,
      date: "2024-01-05",
      comment: "Love this! Noticed improvement in my skin texture within a week.",
      verified: true,
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handlePurchase = () => {
    // Pass product data to checkout
    const checkoutData = {
      product: {
        ...product,
        selectedVariant: product.variants[selectedVariant],
        quantity,
      },
    };
    navigate("/checkout", { state: checkoutData });
  };

  const currentVariant = product.variants[selectedVariant];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Navigation */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to="/mall" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            Back to Mall
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {/* Sale Badge */}
              {product.isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-md font-semibold">
                  SALE
                </div>
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-lime-400" : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <div className="text-lime-400 font-semibold text-lg FontNoto">{product.brand}</div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white FontNoto mt-2">{product.name}</h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-gray-300">{product.rating}</span>
              </div>
              <div className="text-gray-400">({product.reviews} reviews)</div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-lime-400">${currentVariant.price}</span>
              {currentVariant.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${currentVariant.originalPrice}</span>
              )}
              {product.isOnSale && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-md font-semibold">
                  {Math.round((1 - currentVariant.price / currentVariant.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white FontNoto">Size</h3>
                <div className="flex gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedVariant === index
                          ? "border-lime-400 bg-lime-400/20 text-lime-400"
                          : "border-gray-700 hover:border-gray-500 text-gray-300"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white FontNoto">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[#1a1a1a] border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex items-center justify-center text-white"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-10 h-10 bg-[#1a1a1a] border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex items-center justify-center text-white"
                >
                  +
                </button>
                <span className="text-gray-400 ml-2">({product.stockCount} available)</span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-black font-bold py-4 rounded-lg text-lg FontNoto hover:from-lime-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-lime-400/25"
            >
              Add to Cart - ${(currentVariant.price * quantity).toFixed(2)}
            </button>

            {/* Trust Badges */}
            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 text-gray-300">
                <Truck size={16} />
                <span className="text-sm">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Shield size={16} />
                <span className="text-sm">Authentic Products</span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-200 text-sm FontLato">
                <strong>Notice:</strong> Shipping and customer support are handled directly by each brand.
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-800 pt-16">
          <div className="space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-white FontNoto mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed FontLato">{product.description}</p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-2xl font-bold text-white FontNoto mb-4">Key Features</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-center">
                    <span className="text-lime-400 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use */}
            <div>
              <h2 className="text-2xl font-bold text-white FontNoto mb-4">How to Use</h2>
              <p className="text-gray-300 FontLato">{product.howToUse}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-bold text-white FontNoto mb-4">Ingredients</h2>
              <p className="text-gray-300 FontLato">{product.ingredients}</p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-white FontNoto mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{review.name}</span>
                          {review.verified && (
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Verified</span>
                          )}
                        </div>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-300 FontLato">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

