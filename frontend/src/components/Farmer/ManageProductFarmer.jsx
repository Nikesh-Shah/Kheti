"use client"

import { useEffect, useState } from "react"
import { getFarmerProducts, addProduct, updateProduct, deleteProduct } from "../../api/api"
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
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa"
import Sidebar from "../Sidebar"
import "../../Styles/ManageProductFarmer.css"

export default function ManageProductFarmer() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [form, setForm] = useState({
    title: "",
    price: "",
    quantity: "",
    unit: "kg",
    category: "",
    images: [],           // <-- Array of File objects
    imagePreviews: [],    // <-- Array of preview URLs
    description: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
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

  // Handle form input
  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload (multiple)
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: files,
      imagePreviews: files.map(file => URL.createObjectURL(file)),
    }));
  }

  // Add or update product
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title)
      formData.append("price", form.price)
      formData.append("quantity", form.quantity)
      formData.append("unit", form.unit)
      formData.append("category", form.category)
      formData.append("description", form.description)
      form.images.forEach((img) => formData.append("images", img)) // append all images

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
        images: [],
        imagePreviews: [],
        description: "",
      })
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
      category: product.category || "",
      images: [], // New images will be selected by user
      imagePreviews: Array.isArray(product.image)
        ? product.image.map(img => (img.startsWith("http") ? img : `/${img.replace(/\\/g, "/")}`))
        : product.image
        ? [product.image]
        : [],
      description: product.description || "",
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Delete product
  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        fetchProducts()
      } catch {
        setError("Error deleting product. Please try again.")
      }
    }
  }

  // Cancel editing
  function handleCancel() {
    setEditingProduct(null)
    setForm({ title: "", price: "", quantity: "", unit: "kg", category: "", image: "", description: "", imagePreview: "" })
  }

  // Filter products based on search term
  const filteredProducts = products.filter(
    (p) =>
      (p.title || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format currency
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
          {/* Header */}
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
                  <input
                    id="category"
                    name="category"
                    placeholder="Enter category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="images">
                    <FaImage className="input-icon" />
                    Images
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  {form.imagePreviews && form.imagePreviews.length > 0 && (
                    <div className="image-preview-list">
                      {form.imagePreviews.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          style={{ maxWidth: 80, maxHeight: 80, marginRight: 8, borderRadius: 6 }}
                        />
                      ))}
                    </div>
                  )}
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
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <FaSpinner className="spinner-icon" /> {editingProduct ? "Updating..." : "Adding..."}
                    </>
                  ) : editingProduct ? (
                    <>
                      <FaCheck /> Update Product
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Product
                    </>
                  )}
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
                {/* Desktop Table */}
                <div className="table-container">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id}>
                          <td className="image-cell">
                            <div className="product-image">
                              {Array.isArray(p.image) && p.image.length > 0 ? (
                                <img
                                  src={p.image[0].startsWith("http") ? p.image[0] : `/${p.image[0].replace(/\\/g, "/")}`}
                                  alt={p.title || p.name}
                                  onError={e => { e.target.src = "/placeholder.svg?height=50&width=50" }}
                                />
                              ) : (
                                <img src="/placeholder.svg?height=50&width=50" alt="No image" />
                              )}
                            </div>
                          </td>
                          <td className="name-cell">
                            <div className="product-name">{p.title || p.name}</div>
                            {p.description && <div className="product-description">{p.description}</div>}
                          </td>
                          <td className="price-cell">{formatCurrency(p.price)}</td>
                          <td className="quantity-cell">
                            <span className={`quantity-badge ${p.quantity <= 10 ? "low-stock" : ""}`}>
                              {p.quantity}
                            </span>
                          </td>
                          <td className="unit-cell">{p.unit}</td>
                          <td className="category-cell">
                            <span className="category-badge">{p.category}</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button className="edit-btn" onClick={() => handleEdit(p)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-products">
                  {filteredProducts.map((p) => (
                    <div key={p._id} className="product-card">
                      <div className="card-header">
                        <div className="product-image">
                          {Array.isArray(p.image) && p.image.length > 0 ? (
                            <img
                              src={p.image[0].startsWith("http") ? p.image[0] : `/${p.image[0].replace(/\\/g, "/")}`}
                              alt={p.title || p.name}
                              onError={e => { e.target.src = "/placeholder.svg?height=80&width=80" }}
                            />
                          ) : (
                            <img src="/placeholder.svg?height=80&width=80" alt="No image" />
                          )}
                        </div>
                        <div className="card-info">
                          <h4 className="card-title">{p.title || p.name}</h4>
                          <div className="card-meta">
                            <span className="card-price">{formatCurrency(p.price)}</span>
                            <span className="card-category">{p.category}</span>
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
    </div>
  )
}
