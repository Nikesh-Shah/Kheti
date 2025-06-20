"use client"

import { useEffect, useState } from "react"
import { getProducts, deleteProduct, updateProduct, getProductById } from "../api/api"
import Sidebar from "./Sidebar"
import "../Styles/ManageProductAdmin.css"
import { useNavigate } from "react-router-dom"

// Define API base URL outside component for better performance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get correct image URL
function getImageUrl(imgPath) {
  if (!imgPath) return "/placeholder.svg";
  
  // If it's already a full URL
  if (imgPath.startsWith("http")) return imgPath;
  
  // Handle uploads paths
  if (imgPath.startsWith("uploads/")) return `${API_BASE_URL}/${imgPath}`;
  if (imgPath.startsWith("/uploads/")) return `${API_BASE_URL}${imgPath}`;
  
  // Default case - assume it's just a filename
  return `${API_BASE_URL}/uploads/${imgPath}`;
}

export default function ManageProductAdmin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { message: 'Please log in to access admin features' } });
        return false;
      }
      
      // Check if user is admin (from stored user data or token)
      const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
      if (userData.role !== 'admin') {
        navigate('/', { state: { message: 'Access denied. Admin privileges required.' } });
        return false;
      }
      
      return true;
    };
    
    if (checkAuth()) {
      fetchProducts();
    }
  }, [navigate]);

  async function fetchProducts() {
    setLoading(true)
    setError("")
    try {
      const res = await getProducts()
      const productsData = res.data || []
      setProducts(productsData)

      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map((product) => {
        return typeof product.category === 'object' 
          ? product.category.name 
          : product.category
      }).filter(Boolean))]
      
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching products:", err)
      if (err.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      } else {
        setError("Failed to fetch products: " + (err.response?.data?.message || err.message))
      }
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    
    setError("")
    setSuccess("")
    
    try {
      // Get token from storage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }
      
      // Pass token in request headers
      await deleteProduct(id);
      setSuccess("Product deleted successfully!")
      // Refresh the products list
      fetchProducts()
    } catch (err) {
      console.error("Error deleting product:", err)
      
      if (err.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to delete this product.");
      } else {
        setError("Failed to delete product: " + (err.response?.data?.message || err.message))
      }
    }
  }

  function handleEdit(productId) {
    // Check authentication before navigating
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError("Authentication required. Please log in again.");
      setTimeout(() => {
        navigate('/login', { state: { message: 'Please log in to edit products' } });
      }, 1000);
      return;
    }
    
    // Navigate to product edit page
    navigate(`/admin/edit-product/${productId}`);
  }

  function handleView(productId) {
    // Navigate to product details page
    navigate(`/product/${productId}`)
  }

  function dismissMessage() {
    setError("")
    setSuccess("")
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const title = product.title || product.name || "";
    const category = typeof product.category === 'object' 
      ? product.category.name 
      : product.category;
    
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.farmer?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || category === categoryFilter
    
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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <div className="manage-products-admin">
          <h2>Manage Products</h2>

          <div className="products-header">
            <div className="products-actions">
              <button 
                className="add-product-btn"
                onClick={() => navigate('/admin/products/add')}
              >
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

          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
              <button className="dismiss-btn" onClick={dismissMessage}>×</button>
            </div>
          )}

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
              <button className="dismiss-btn" onClick={dismissMessage}>×</button>
            </div>
          )}

          {loading ? (
            <div className="loading-products">
              <div className="loading-spinner"></div>
              <span>Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
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
              <button className="add-product-btn" onClick={() => navigate('/admin/products/add')}>Add New Product</button>
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
                    <th>Seller</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-image">
                          {product.mainImage ? (
                            <img
                              src={getImageUrl(product.mainImage)}
                              alt={product.title}
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          ) : Array.isArray(product.image) && product.image.length > 0 ? (
                            <img
                              src={getImageUrl(product.image[0])}
                              alt={product.title || product.name}
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="no-image">No image</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-titleadmin">{product.title || product.name}</div>
                        {product.description && (
                          <div className="product-descriptionadmin">
                            {product.description.length > 50 
                              ? `${product.description.substring(0, 50)}...` 
                              : product.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="category-badge">
                          {typeof product.category === 'object' 
                            ? product.category.name 
                            : product.category}
                        </span>
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
                          <button 
                            className="view-btn" 
                            title="View Product"
                            onClick={() => handleView(product._id)}
                          >
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
                          <button 
                            className="edit-btn" 
                            title="Edit Product"
                            onClick={() => handleEdit(product._id)}
                          >
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
                {currentProducts.map((product) => (
                  <div className="product-card" key={product._id}>
                    <div className="product-card-image">
                      {product.mainImage ? (
                        <img
                          src={getImageUrl(product.mainImage)}
                          alt={product.title || product.name}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      ) : Array.isArray(product.image) && product.image.length > 0 ? (
                        <img
                          src={getImageUrl(product.image[0])}
                          alt={product.title || product.name}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="no-image">No image</div>
                      )}
                    </div>
                    <div className="product-card-content">
                      <div className="product-card-title">{product.title || product.name}</div>
                      <div className="product-card-category">
                        {typeof product.category === 'object' 
                          ? product.category.name 
                          : product.category}
                      </div>
                      <div className="product-card-price">
                        ₹{product.price} / {product.unit}
                      </div>
                      <div className="product-card-farmer">
                        <div className="farmer-avatar">{getFarmerInitials(product.farmer)}</div>
                        <span>{product.farmer?.firstName || product.farmer || "N/A"}</span>
                      </div>
                      <div className="product-card-actions">
                        <button 
                          className="view-btn" 
                          title="View Product"
                          onClick={() => handleView(product._id)}
                        >
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
                        <button 
                          className="edit-btn" 
                          title="Edit Product"
                          onClick={() => handleEdit(product._id)}
                        >
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
