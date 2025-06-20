"use client"

import { useEffect, useState } from "react"
import { getFarmerProducts, addProduct, updateProduct, deleteProduct, getCategories } from "../../api/api"
import {
  FaBox,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaImage,
  FaRupeeSign,
  FaBoxes,
  FaTags,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa"
import Sidebar from "../Sidebar"
import "../../Styles/ManageProductFarmer.css"

// Define API base URL outside component for better performance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Updated helper to get correct image URL with cross-origin support
function getImageUrl(img) {
  if (!img) return "/placeholder.svg";
  
  // If it's already a full URL
  if (img.startsWith("http")) return img;
  
  // If it starts with /uploads, add API base URL
  if (img.startsWith("/uploads/")) return `${API_BASE_URL}${img}`;
  
  // If it starts with uploads/ without leading slash, add API base URL and leading slash
  if (img.startsWith("uploads/")) return `${API_BASE_URL}/${img}`;
  
  // For any other value, just use as filename in uploads directory
  return `${API_BASE_URL}/uploads/${img.split(/[/\\]/).pop()}`;
}

export default function ManageProductFarmer() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Main image and additional images
  const [form, setForm] = useState({
    title: "",
    price: "",
    quantity: "",
    unit: "kg",
    category: "",
    mainImage: null,
    mainImagePreview: "",
    images: [],
    imagePreviews: [],
    description: "",
  })
  const [imageInputs, setImageInputs] = useState([0]) // for additional images
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError("")
    try {
      const res = await getFarmerProducts()
      setProducts(res.data || [])
    } catch (err) {
      setProducts([])
      setError("Failed to fetch products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    setLoading(true)
    setError("")
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch (err) {
      setCategories([])
      setError("Failed to fetch categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Main image handler
  function handleMainImageChange(e) {
    const file = e.target.files[0];
    setForm(prev => ({
      ...prev,
      mainImage: file,
      mainImagePreview: file ? URL.createObjectURL(file) : ""
    }));
  }

  // Additional images handler
  function handleImageChange(e, idx) {
    const file = e.target.files[0];
    setForm(prev => {
      const newImages = [...prev.images];
      newImages[idx] = file;
      const newPreviews = [...prev.imagePreviews];
      newPreviews[idx] = file ? URL.createObjectURL(file) : undefined;
      return { ...prev, images: newImages, imagePreviews: newPreviews };
    });
  }

  function handleAddImageInput() {
    setImageInputs(prev => [...prev, prev.length]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", form.title)
      formData.append("price", form.price)
      formData.append("quantity", form.quantity)
      formData.append("unit", form.unit)
      formData.append("category", form.category)
      formData.append("description", form.description)
      if (form.mainImage) {
        formData.append("mainImage", form.mainImage)
      }
      form.images.forEach(img => {
        if (img) formData.append("images", img)
      })

      // Add some debugging
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData)
      } else {
        await addProduct(formData)
      }
      setForm({
        title: "",
        price: "",
        quantity: "",
        unit: "kg",
        category: "",
        mainImage: null,
        mainImagePreview: "",
        images: [],
        imagePreviews: [],
        description: "",
      })
      setImageInputs([0])
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      setError("Error saving product. Please check your inputs and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Edit product (show previews for existing images)
  function handleEdit(product) {
    setEditingProduct(product)
    setForm({
      title: product.title || product.name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      unit: product.unit || "kg",
      category: product.category?._id || product.category || "",
      mainImage: null,
      mainImagePreview: Array.isArray(product.image) && product.image.length > 0
        ? getImageUrl(product.image[0])
        : "",
      images: [],
      imagePreviews: Array.isArray(product.image)
        ? product.image.slice(1).map(getImageUrl)
        : [],
      description: product.description || "",
    })
    setImageInputs([0]) // reset additional image inputs
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
        .then(fetchProducts)
        .catch(() => setError("Error deleting product. Please try again."))
    }
  }

  function handleCancel() {
    setEditingProduct(null)
    setForm({
      title: "",
      price: "",
      quantity: "",
      unit: "kg",
      category: "",
      mainImage: null,
      mainImagePreview: "",
      images: [],
      imagePreviews: [],
      description: "",
    })
    setImageInputs([0])
  }

  const filteredProducts = products.filter(
    (p) =>
      (p.title || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || p.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="farmer" />
      <main className="dashboard-main">
        <div className="products-container">
          <div className="products-header">
            <div className="header-content">
              <h2 className="products-title">
                <FaBox className="title-icon" />
                Manage My Products
              </h2>
              <p className="products-subtitle">Add, edit, and manage your agricultural products</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Total Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{products.reduce((sum, p) => sum + (p.quantity || 0), 0)}</span>
                <span className="stat-label">Total Stock</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FaExclamationTriangle className="error-icon" />
              <span>{error}</span>
              <button className="dismiss-btn" onClick={() => setError("")}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* Product Form */}
          <div className="form-container">
            <div className="form-header">
              <h3 className="form-title">
                {editingProduct ? (
                  <>
                    <FaEdit className="form-icon" /> Edit Product
                  </>
                ) : (
                  <>
                    <FaPlus className="form-icon" /> Add New Product
                  </>
                )}
              </h3>
            </div>
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-groupfarmer">
                  <label htmlFor="title">
                    <FaBox className="input-icon" />
                    Product Name
                  </label>
                  <input
                    id="title"
                    name="title"
                    placeholder="Enter product name"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">
                    <FaRupeeSign className="input-icon" />
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">
                    <FaBoxes className="input-icon" />
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="kg">Kg</option>
                    <option value="piece">Per Piece</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">
                    <FaTags className="input-icon" />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main Image */}
                <div className="form-group">
                  <label>
                    <FaImage className="input-icon" />
                    Main Image <span style={{color: "#d32f2f"}}>*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editingProduct}
                    onChange={handleMainImageChange}
                  />
                  <img
                    src={form.mainImagePreview || "/placeholder.svg"}
                    alt="Main product preview"
                    style={{ maxWidth: 80, maxHeight: 80, marginTop: 8, borderRadius: 6 }}
                  />
                </div>

                {/* Additional Images */}
                <div className="form-group">
                  <label>
                    <FaImage className="input-icon" />
                    Additional Images
                  </label>
                  {imageInputs.map((inputIdx) => (
                    <div key={inputIdx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageChange(e, inputIdx)}
                      />
                      <img
                        src={form.imagePreviews[inputIdx] || "/placeholder.svg"}
                        alt={`Product preview ${inputIdx + 1}`}
                        style={{ maxWidth: 60, maxHeight: 60, marginLeft: 8, borderRadius: 6 }}
                      />
                    </div>
                  ))}
                  <button type="button" className="add-image-btn" onClick={handleAddImageInput} style={{ marginTop: 4 }}>
                    + Add More
                  </button>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? (editingProduct ? "Updating..." : "Adding...") : (editingProduct ? "Update Product" : "Add Product")}
                </button>
                {editingProduct && (
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="products-list-container">
            <div className="list-header">
              <h3 className="list-title">Your Products</h3>
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <FaSpinner className="loading-spinner" />
                <h3>Loading Products...</h3>
                <p>Fetching your product data</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <FaBox className="empty-icon" />
                <h3>No Products Found</h3>
                <p>You haven't added any products yet. Use the form above to add your first product.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h3>No matching products</h3>
                <p>Try adjusting your search term</p>
              </div>
            ) : (
              <>
                <div className="mobile-products">
                  {filteredProducts.map((p) => (
                    <div key={p._id} className="product-card">
                      <div className="card-header">
                        <div className="product-image">
                          {p.mainImage ? (
                            <img
                              src={getImageUrl(p.mainImage)}
                              alt={p.title || p.name}
                              onError={e => { 
                                const placeholderPath = "/placeholder.svg";
                                if (!e.target.src.endsWith(placeholderPath)) {
                                  e.target.src = placeholderPath;
                                  e.target.onerror = null; // Prevent future errors
                                }
                              }}
                            />
                          ) : Array.isArray(p.image) && p.image.length > 0 ? (
                            <img
                              src={getImageUrl(p.image[0])}
                              alt={p.title || p.name}
                              onError={e => { 
                                const placeholderPath = "/placeholder.svg";
                                if (!e.target.src.endsWith(placeholderPath)) {
                                  e.target.src = placeholderPath;
                                  e.target.onerror = null;
                                }
                              }}
                            />
                          ) : (
                            <img src="/placeholder.svg" alt="No product available" />
                          )}
                        </div>
                        <div className="card-info">
                          <h4 className="card-title">{p.title || p.name}</h4>
                          <div className="card-meta">
                            <span className="card-price">{formatCurrency(p.price)}</span>
                            <span className="card-category">{p.category?.name || p.category}</span>
                          </div>
                        </div>
                      </div>
                      {p.description && <p className="card-description">{p.description}</p>}
                      <div className="card-footer">
                        <div className="card-quantity">
                          <FaBoxes className="quantity-icon" />
                          <span className={`quantity-text ${p.quantity <= 10 ? "low-stock" : ""}`}>
                            {p.quantity} {p.unit}
                          </span>
                        </div>
                        <div className="card-actions">
                          <button className="mobile-edit-btn" onClick={() => handleEdit(p)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="mobile-delete-btn" onClick={() => handleDelete(p._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <div style={{display: 'none'}}>
        {console.log("Products:", products)}
        {filteredProducts.map((p, i) => (
          <div key={i}>
            <p>Product {i}: {p.title}</p>
            <p>MainImage: {p.mainImage}</p>
            <p>Images: {JSON.stringify(p.image)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
