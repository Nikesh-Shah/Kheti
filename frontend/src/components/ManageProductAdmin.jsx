"use client"

import { useEffect, useState } from "react"
import { getProducts, deleteProduct } from "../api/api"
import Sidebar from "./Sidebar"
import "../Styles/ManageProductAdmin.css"

export default function ManageProductAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError("")
    try {
      const res = await getProducts()
      const productsData = res.data || []
      setProducts(productsData)

      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map((product) => product.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      setError("Failed to fetch products.")
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    setError("")
    setSuccess("")
    try {
      await deleteProduct(id)
      setSuccess("Product deleted successfully!")
      fetchProducts()
    } catch (err) {
      setError("Failed to delete product.")
    }
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.farmer?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity <= 0) return "out-of-stock"
    if (quantity < 10) return "low-stock"
    return "in-stock"
  }

  // Get farmer initials
  const getFarmerInitials = (farmer) => {
    if (!farmer) return "NA"
    if (typeof farmer === "string") return farmer.charAt(0).toUpperCase()
    return farmer.firstName ? farmer.firstName.charAt(0).toUpperCase() : "NA"
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <div className="manage-products-admin">
          <h2>Manage Products</h2>

          <div className="products-header">
            <div className="products-actions">
              <button className="add-product-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Product
              </button>

              <div className="filter-dropdown">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="search-products">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-products">
              <div className="loading-spinner"></div>
              <span>Loading products...</span>
            </div>
          ) : error ? (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          ) : (
            <>
              {success && (
                <div className="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="empty-products">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3>No products found</h3>
                  <p>
                    There are no products matching your search criteria. Try adjusting your filters or add a new product.
                  </p>
                  <button className="add-product-btn">Add New Product</button>
                </div>
              ) : (
                <>
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Farmer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-image">
                              {Array.isArray(product.image) && product.image.length > 0 ? (
                                <img
                                  src={
                                    product.image[0].startsWith("http")
                                      ? product.image[0]
                                      : `/${product.image[0].replace(/\\/g, "/")}`
                                  }
                                  alt={product.title}
                                />
                              ) : (
                                <div className="no-image">No image</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="product-titleadmin">{product.title}</div>
                            {product.description && <div className="product-descriptionadmin">{product.description}</div>}
                          </td>
                          <td>
                            <span className="category-badge">{product.category}</span>
                          </td>
                          <td>
                            <span className="product-price">₹{product.price}</span>
                          </td>
                          <td>
                            <div className={`stock-indicator ${getStockStatus(product.quantity)}`}>
                              <span></span>
                              {product.quantity}
                            </div>
                          </td>
                          <td>{product.unit}</td>
                          <td>
                            <div className="farmer-info">
                              <div className="farmer-avatar">{getFarmerInitials(product.farmer)}</div>
                              <span>{product.farmer?.firstName || product.farmer || "N/A"}</span>
                            </div>
                          </td>
                          <td>
                            <div className="product-actions">
                              <button className="view-btn" title="View Product">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  width="18"
                                  height="18"
                                >
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button className="edit-btn" title="Edit Product">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  width="18"
                                  height="18"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDelete(product._id)}
                                title="Delete Product"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  width="18"
                                  height="18"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile view - cards */}
                  <div className="products-grid">
                    {filteredProducts.map((product) => (
                      <div className="product-card" key={product._id}>
                        <div className="product-card-image">
                          {Array.isArray(product.image) && product.image.length > 0 ? (
                            <img
                              src={
                                product.image[0].startsWith("http")
                                  ? product.image[0]
                                  : `/${product.image[0].replace(/\\/g, "/")}`
                              }
                              alt={product.title}
                            />
                          ) : (
                            <div className="no-image">No image</div>
                          )}
                        </div>
                        <div className="product-card-content">
                          <div className="product-card-title">{product.title}</div>
                          <div className="product-card-category">{product.category}</div>
                          <div className="product-card-price">
                            ₹{product.price} / {product.unit}
                          </div>
                          <div className="product-card-farmer">
                            <div className="farmer-avatar">{getFarmerInitials(product.farmer)}</div>
                            <span>{product.farmer?.firstName || product.farmer || "N/A"}</span>
                          </div>
                          <div className="product-card-actions">
                            <button className="view-btn" title="View Product">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="18"
                                height="18"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button className="edit-btn" title="Edit Product">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="18"
                                height="18"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(product._id)} title="Delete Product">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="18"
                                height="18"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pagination">
                    <button disabled>&lt;</button>
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>&gt;</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
