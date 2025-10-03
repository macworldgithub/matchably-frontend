/** @format */

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  GripVertical,
  ArrowLeft,
  Save,
  ImageIcon,
  Star,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import config from "../../../config";
import Cookies from "js-cookie";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const token = Cookies.get("AdminToken");

  // Form state
  const [productForm, setProductForm] = useState({
    name: "",
    brandName: "",
    category: "",
    description: "",
    shortDescription: "",
    sellingPrice: "",
    comparePrice: "",
    costPrice: "",
    mainImage: null,
    subImages: [],
    variants: [],
    keyFeatures: [],
    howToUse: "",
    ingredients: "",
    specifications: [],
    affiliateCommissionPercentage: 10,
    badges: {
      fastShipping: false,
      authenticProducts: false,
      sale: false,
      featured: false,
      bestSeller: false,
    },
    status: "draft",
    stock: 0,
    lowStockThreshold: 10,
    trackStock: true,
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [subImageFiles, setSubImageFiles] = useState([]);

  // Sample brands for dropdown
  const brands = [
    "Beauty Co",
    "TechPro",
    "FashionPlus",
    "HomeStyle",
    "WellnessFirst",
  ];

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BACKEND_URL}/admin/mall/products?page=${page}&limit=20&search=${searchTerm}&status=${statusFilter}&category=${categoryFilter}`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
        setCategories(data.data.categories);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  // Products are already filtered by backend

  // Handle product creation/update
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Prepare product data
      const productData = {
        ...productForm,
        sellingPrice: parseFloat(productForm.sellingPrice),
        comparePrice: productForm.comparePrice
          ? parseFloat(productForm.comparePrice)
          : null,
        costPrice: productForm.costPrice
          ? parseFloat(productForm.costPrice)
          : null,
        stock: parseInt(productForm.stock) || 0,
        lowStockThreshold: parseInt(productForm.lowStockThreshold) || 10,
        affiliateCommissionPercentage:
          parseFloat(productForm.affiliateCommissionPercentage) || 10,
      };

      // When editing, preserve existing images if no new files are uploaded
      if (editingProduct && !mainImageFile) {
        productData.mainImage = productForm.mainImage;
      }

      if (editingProduct && subImageFiles.length === 0) {
        productData.subImages = productForm.subImages;
      }

      formData.append("productData", JSON.stringify(productData));

      // Only append new image files
      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      }

      subImageFiles.forEach((file) => {
        formData.append("subImages", file);
      });

      const url = editingProduct
        ? `${config.BACKEND_URL}/admin/mall/products/${editingProduct._id}`
        : `${config.BACKEND_URL}/admin/mall/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: token },
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        setShowProductForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts(currentPage);
      } else {
        toast.error(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      brandName: "",
      category: "",
      description: "",
      shortDescription: "",
      sellingPrice: "",
      comparePrice: "",
      costPrice: "",
      mainImage: null,
      subImages: [],
      variants: [],
      keyFeatures: [],
      howToUse: "",
      ingredients: "",
      specifications: [],
      affiliateCommissionPercentage: 10,
      badges: {
        fastShipping: false,
        authenticProducts: false,
        sale: false,
        featured: false,
        bestSeller: false,
      },
      status: "draft",
      stock: 0,
      lowStockThreshold: 10,
      trackStock: true,
    });
    setMainImageFile(null);
    setSubImageFiles([]);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `${config.BACKEND_URL}/admin/mall/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Product deleted successfully!");
        fetchProducts(currentPage);
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // View product
  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setProductForm({
      ...product,
      sellingPrice: product.sellingPrice?.toString() || "",
      comparePrice: product.comparePrice?.toString() || "",
      costPrice: product.costPrice?.toString() || "",
      stock: product.stock?.toString() || "0",
      lowStockThreshold: product.lowStockThreshold?.toString() || "10",
      affiliateCommissionPercentage:
        product.affiliateCommissionPercentage?.toString() || "10",
      // Ensure proper image handling for existing products
      mainImage: product.mainImage || null,
      subImages: product.subImages || [],
    });

    // Clear any file states since we're editing existing product
    setMainImageFile(null);
    setSubImageFiles([]);

    setEditingProduct(product);
    setShowProductForm(true);
  };

  // Handle main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setMainImageFile(file);
      setProductForm((prev) => ({
        ...prev,
        mainImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} (not an image)`);
      } else if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(", ")}`);
    }

    if (validFiles.length > 0) {
      // Check total images limit (10 max)
      const currentCount = subImageFiles.length;
      const newCount = currentCount + validFiles.length;

      if (newCount > 10) {
        toast.error(`Maximum 10 sub-images allowed (current: ${currentCount})`);
        return;
      }

      setSubImageFiles((prev) => [...prev, ...validFiles]);

      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
      setProductForm((prev) => ({
        ...prev,
        subImages: [...prev.subImages, ...imageUrls],
      }));
    }
  };

  const removeSubImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      subImages: prev.subImages.filter((_, i) => i !== index),
    }));
    setSubImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove main image
  const removeMainImage = () => {
    setProductForm((prev) => ({ ...prev, mainImage: null }));
    setMainImageFile(null);
  };

  // Add variant
  const addVariant = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          options: [{ value: "", stock: 0, priceModifier: 0 }],
        },
      ],
    }));
  };

  // Update variant
  const updateVariant = (variantIndex, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  // Add variant option
  const addVariantOption = (variantIndex) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              options: [
                ...variant.options,
                { value: "", stock: 0, priceModifier: 0 },
              ],
            }
          : variant
      ),
    }));
  };

  // Update variant option
  const updateVariantOption = (variantIndex, optionIndex, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              options: variant.options.map((option, oIndex) =>
                oIndex === optionIndex ? { ...option, [field]: value } : option
              ),
            }
          : variant
      ),
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Remove variant option
  const removeVariantOption = (variantIndex, optionIndex) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              options: variant.options.filter(
                (_, oIndex) => oIndex !== optionIndex
              ),
            }
          : variant
      ),
    }));
  };

  // Add key feature
  const addKeyFeature = () => {
    if (productForm.keyFeatures.length < 5) {
      setProductForm((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, ""],
      }));
    }
  };

  // Update key feature
  const updateKeyFeature = (index, value) => {
    setProductForm((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  // Remove key feature
  const removeKeyFeature = (index) => {
    setProductForm((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  // Add specification
  const addSpecification = () => {
    setProductForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }));
  };

  // Update specification
  const updateSpecification = (index, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  // Remove specification
  const removeSpecification = (index) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "out_of_stock":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (showProductForm) {
    return (
      <div className="p-6 bg-[#141414] min-h-screen text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => resetForm()}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h1>
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-8">
            {/* Images Section */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>

              {/* Main Image */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Main Product Image *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  {productForm.mainImage ? (
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={productForm.mainImage}
                          alt="Main product image"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload
                        size={32}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-400 mb-2">
                        Click to upload main image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <label
                        htmlFor="main-image-upload"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors cursor-pointer inline-block"
                      >
                        Upload Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub Images */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Additional Images (up to 5)
                </label>
                <div className="grid grid-cols-5 gap-4">
                  {productForm.subImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Sub image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: "none" }}
                        >
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {productForm.subImages.length < 5 && (
                    <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSubImageUpload}
                        className="hidden"
                        id="sub-images-upload"
                      />
                      <label
                        htmlFor="sub-images-upload"
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                      >
                        <Plus size={20} className="text-gray-400" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Brand Name *
                  </label>
                  <select
                    required
                    value={productForm.brandName}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        brandName: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={productForm.shortDescription}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        shortDescription: e.target.value,
                      }))
                    }
                    rows={2}
                    maxLength={160}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Short description for SEO (max 160 chars)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {productForm.shortDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.sellingPrice}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        sellingPrice: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Compare-at Price (triggers SALE badge)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.comparePrice}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        comparePrice: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Cost Price (for profit calculation)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.costPrice}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        costPrice: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Affiliate Commission %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={productForm.affiliateCommissionPercentage}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        affiliateCommissionPercentage: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Stock Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.lowStockThreshold}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        lowStockThreshold: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="10"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={productForm.trackStock}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          trackStock: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <span>Track stock levels</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Product Variants</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Add Variant
                </button>
              </div>
              <div className="space-y-6">
                {productForm.variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        placeholder="Variant name (e.g., Size, Color)"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(variantIndex, "name", e.target.value)
                        }
                        className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white mr-3"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {variant.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="grid grid-cols-3 gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Value (e.g., M, Red)"
                            value={option.value}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "value",
                                e.target.value
                              )
                            }
                            className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                          />
                          <input
                            type="number"
                            placeholder="Stock"
                            value={option.stock}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                          />
                          {/* SKU removed - using MongoDB _id */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Price +"
                              value={option.priceModifier}
                              onChange={(e) =>
                                updateVariantOption(
                                  variantIndex,
                                  optionIndex,
                                  "priceModifier",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeVariantOption(variantIndex, optionIndex)
                              }
                              className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addVariantOption(variantIndex)}
                        className="w-full py-2 border-2 border-dashed border-gray-600 rounded text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Key Features (up to 5)
                </h3>
                <button
                  type="button"
                  onClick={addKeyFeature}
                  disabled={productForm.keyFeatures.length >= 5}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {productForm.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Feature (e.g., Vitamin E)"
                      value={feature}
                      onChange={(e) => updateKeyFeature(index, e.target.value)}
                      className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Product Specifications
                </h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Add Specification
                </button>
              </div>
              <div className="space-y-3">
                {productForm.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., Weight)"
                      value={spec.name}
                      onChange={(e) =>
                        updateSpecification(index, "name", e.target.value)
                      }
                      className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g., 50g)"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(index, "value", e.target.value)
                        }
                        className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Description *</h3>
              <textarea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Enter product description..."
              />
            </div>

            {/* How to Use */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">How to Use</h3>
              <textarea
                value={productForm.howToUse}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    howToUse: e.target.value,
                  }))
                }
                rows={3}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Enter usage instructions..."
              />
            </div>

            {/* Ingredients */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <textarea
                value={productForm.ingredients}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    ingredients: e.target.value,
                  }))
                }
                rows={2}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Enter ingredients separated by commas..."
              />
            </div>

            {/* Badges */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Badges & Tags</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={productForm.badges.fastShipping}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        badges: {
                          ...prev.badges,
                          fastShipping: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  <span>Fast Shipping</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={productForm.badges.authenticProducts}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        badges: {
                          ...prev.badges,
                          authenticProducts: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  <span>Authentic Products</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={productForm.badges.featured}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        badges: {
                          ...prev.badges,
                          featured: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={productForm.badges.bestSeller}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        badges: {
                          ...prev.badges,
                          bestSeller: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  <span>Best Seller</span>
                </label>
                <div className="flex items-center gap-3 text-gray-400">
                  <input
                    type="checkbox"
                    checked={
                      productForm.comparePrice &&
                      parseFloat(productForm.comparePrice) >
                        parseFloat(productForm.sellingPrice || 0)
                    }
                    disabled
                    className="rounded"
                  />
                  <span>
                    SALE (automatically enabled when compare price is higher)
                  </span>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={productForm.metaTitle || productForm.name}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        metaTitle: e.target.value,
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="SEO title (auto-filled from product name)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={
                      productForm.metaDescription ||
                      productForm.shortDescription
                    }
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                    rows={2}
                    maxLength={160}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="SEO meta description (auto-filled from short description)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      (
                        productForm.metaDescription ||
                        productForm.shortDescription
                      ).length
                    }
                    /160 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={productForm.urlSlug || ""}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        urlSlug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-"),
                      }))
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
                    placeholder="Auto-generated from product name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /products/
                    {productForm.urlSlug ||
                      productForm.name
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .replace(/-+/g, "-")}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <select
                value={productForm.status}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded transition-colors"
              >
                <Save size={18} />
                {submitting
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Product Modal
  if (viewingProduct) {
    return (
      <div className="p-6 bg-[#141414] min-h-screen text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setViewingProduct(null)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Product Details</h1>
          </div>

          {/* Product Details */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Main Product Info */}
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Images</h3>
                  {viewingProduct.mainImage && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Main Image:</p>
                      <img
                        src={viewingProduct.mainImage}
                        alt={viewingProduct.name}
                        className="w-full max-w-sm h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {viewingProduct.subImages &&
                    viewingProduct.subImages.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Sub Images:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {viewingProduct.subImages.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${viewingProduct.name} ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Product ID:</p>
                      <p className="text-white font-mono text-xs">
                        {viewingProduct._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Name:</p>
                      <p className="text-white">{viewingProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Brand:</p>
                      <p className="text-white">{viewingProduct.brandName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Category:</p>
                      <p className="text-white">{viewingProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status:</p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          viewingProduct.status === "active"
                            ? "bg-green-600"
                            : viewingProduct.status === "draft"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {viewingProduct.status?.charAt(0).toUpperCase() +
                          viewingProduct.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Selling Price:</p>
                  <p className="text-white font-semibold text-xl">
                    ${viewingProduct.sellingPrice}
                  </p>
                </div>
                {viewingProduct.comparePrice && (
                  <div>
                    <p className="text-sm text-gray-400">Compare Price:</p>
                    <p className="text-gray-300 line-through">
                      ${viewingProduct.comparePrice}
                    </p>
                  </div>
                )}
                {viewingProduct.costPrice && (
                  <div>
                    <p className="text-sm text-gray-400">Cost Price:</p>
                    <p className="text-gray-300">${viewingProduct.costPrice}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Full Description:</p>
                  <p className="text-white whitespace-pre-wrap">
                    {viewingProduct.description}
                  </p>
                </div>
                {viewingProduct.shortDescription && (
                  <div>
                    <p className="text-sm text-gray-400">Short Description:</p>
                    <p className="text-gray-300">
                      {viewingProduct.shortDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stock & Inventory */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Stock & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Current Stock:</p>
                  <p className="text-white font-semibold">
                    {viewingProduct.stock || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Low Stock Threshold:</p>
                  <p className="text-white">
                    {viewingProduct.lowStockThreshold || 10}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Track Stock:</p>
                  <p className="text-white">
                    {viewingProduct.trackStock ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Variants */}
            {viewingProduct.variants && viewingProduct.variants.length > 0 && (
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Variants</h3>
                <div className="space-y-4">
                  {viewingProduct.variants.map((variant, index) => (
                    <div key={index} className="bg-[#2a2a2a] p-4 rounded">
                      <h4 className="font-medium mb-2">{variant.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {variant.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="bg-[#3a3a3a] p-2 rounded text-sm"
                          >
                            <p>
                              <span className="text-gray-400">Value:</span>{" "}
                              {option.value}
                            </p>
                            <p>
                              <span className="text-gray-400">Stock:</span>{" "}
                              {option.stock}
                            </p>
                            {option.priceModifier !== 0 && (
                              <p>
                                <span className="text-gray-400">
                                  Price Modifier:
                                </span>{" "}
                                ${option.priceModifier}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {viewingProduct.keyFeatures &&
              viewingProduct.keyFeatures.length > 0 && (
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-1">
                    {viewingProduct.keyFeatures.map((feature, index) => (
                      <li key={index} className="text-gray-300">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Additional Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Affiliate Commission:
                  </p>
                  <p className="text-white">
                    {viewingProduct.affiliateCommissionPercentage || 10}%
                  </p>
                </div>
                {viewingProduct.urlSlug && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">URL Slug:</p>
                    <p className="text-white font-mono text-sm">
                      {viewingProduct.urlSlug}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Created:</p>
                  <p className="text-white">
                    {new Date(viewingProduct.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Last Updated:</p>
                  <p className="text-white">
                    {new Date(viewingProduct.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#141414] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Package className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold">Product Management</h1>
          </div>
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Products</h3>
            <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Active Products</h3>
            <p className="text-2xl font-bold text-green-400">
              {stats.active || 0}
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Draft Products</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.draft || 0}
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-gray-400 text-sm">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-400">
              {stats.outOfStock || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-800">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Brand
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Price
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Variants
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Created
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-800 hover:bg-[#2a2a2a]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.mainImage ? (
                              <img
                                src={product.mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={16} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {product._id}
                            </p>
                            {product.keyFeatures &&
                              product.keyFeatures.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {product.keyFeatures
                                    .slice(0, 2)
                                    .map((feature, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                  {product.keyFeatures.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                                      +{product.keyFeatures.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">
                          {product.brandName}
                        </span>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="text-white font-semibold">
                            ${product.sellingPrice?.toFixed(2)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-gray-400 line-through ml-2">
                              ${product.comparePrice.toFixed(2)}
                            </span>
                          )}
                          {product.affiliateCommissionPercentage && (
                            <p className="text-xs text-green-400">
                              {product.affiliateCommissionPercentage}%
                              commission
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="text-sm">
                          {product.variants?.length || 0} variants
                          {product.trackStock && (
                            <p className="text-xs text-gray-500">
                              Stock: {product.stock || 0}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                        {product.badges && (
                          <div className="flex gap-1 mt-1">
                            {product.badges.featured && (
                              <Star size={12} className="text-yellow-400" />
                            )}
                            {product.badges.sale && (
                              <span className="px-1 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                                SALE
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Eye size={16} className="text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Edit size={16} className="text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-[#1f1f1f] rounded-lg border border-gray-800 p-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing page {pagination.currentPage} of {pagination.totalPages}(
              {pagination.totalProducts} total products)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
