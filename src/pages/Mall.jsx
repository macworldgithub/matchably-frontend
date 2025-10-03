/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronDown } from "lucide-react";

const Mall = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Mock product data - in real app this would come from API
  const products = [
    {
      id: 1,
      name: "Hydrating Serum",
      brand: "K-Beauty Co",
      price: 24.99,
      originalPrice: 29.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "skincare",
      rating: 4.8,
      reviews: 234,
      isOnSale: true,
    },
    {
      id: 2,
      name: "Matte Lipstick Set",
      brand: "Seoul Beauty",
      price: 32.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "makeup",
      rating: 4.6,
      reviews: 189,
      isOnSale: false,
    },
    {
      id: 3,
      name: "Vitamin C Cleanser",
      brand: "Glow Labs",
      price: 18.99,
      originalPrice: 22.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "skincare",
      rating: 4.9,
      reviews: 412,
      isOnSale: true,
    },
    {
      id: 4,
      name: "Sheet Mask Pack",
      brand: "Nature Fresh",
      price: 15.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "skincare",
      rating: 4.4,
      reviews: 156,
      isOnSale: false,
    },
    {
      id: 5,
      name: "BB Cream SPF 30",
      brand: "Perfect Skin",
      price: 28.99,
      originalPrice: 34.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "makeup",
      rating: 4.7,
      reviews: 298,
      isOnSale: true,
    },
    {
      id: 6,
      name: "Hair Treatment Mask",
      brand: "Silky Hair",
      price: 21.99,
      image: "/assets/logo_matchably.png", // placeholder
      category: "haircare",
      rating: 4.5,
      reviews: 87,
      isOnSale: false,
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "skincare", label: "Skincare" },
    { value: "makeup", label: "Makeup" },
    { value: "haircare", label: "Hair Care" },
  ];

  const brands = [
    { value: "all", label: "All Brands" },
    { value: "K-Beauty Co", label: "K-Beauty Co" },
    { value: "Seoul Beauty", label: "Seoul Beauty" },
    { value: "Glow Labs", label: "Glow Labs" },
    { value: "Nature Fresh", label: "Nature Fresh" },
    { value: "Perfect Skin", label: "Perfect Skin" },
    { value: "Silky Hair", label: "Silky Hair" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return b.reviews - a.reviews; // popular by reviews
    }
  });

  const ProductCard = ({ product }) => (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:scale-105">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          />
          {product.isOnSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
              SALE
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            ⭐ {product.rating}
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-sm text-gray-400 mb-1">{product.brand}</div>
          <h3 className="text-white font-semibold mb-2 group-hover:text-lime-400 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lime-400 font-bold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-sm">${product.originalPrice}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {product.reviews} reviews
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold FontNoto mb-4">
            <span className="text-white">Matchably</span>{" "}
            <span className="text-lime-400">Mall</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto FontLato">
            Discover authentic K-beauty products directly from verified brands
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white hover:border-lime-400 transition-colors"
          >
            <Filter size={16} />
            Filters
            <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
          </button>

          {/* Filter Options */}
          <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lime-400 transition-colors"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lime-400 transition-colors"
            >
              {brands.map((brand) => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lime-400 transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="lg:ml-auto flex items-center text-gray-400">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">No products found</div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedBrand("all");
              }}
              className="text-lime-400 hover:text-lime-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-2 text-white FontNoto">
            Shop with Confidence
          </h3>
          <p className="text-gray-300 FontLato">
            All products are sourced directly from verified K-beauty brands. 
            Shipping and customer support are handled directly by each brand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mall;

