"use client"

import { useEffect, useState } from "react"
import { getCategories, addCategory, updateCategory, deleteCategory } from "../api/api"
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa"
import Sidebar from "./Sidebar"
import "../Styles/ManageCategoryAdmin.css"

export default function ManageCategoryAdmin() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: "", _id: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    setError("")
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch (err) {
      setError("Failed to fetch categories. Please try again.")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(category) {
    setForm({ name: category.name, _id: category._id })
    setError("")
    setSuccess("")
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      if (form._id) {
        await updateCategory(form._id, { name: form.name })
        setSuccess("Category updated successfully!")
      } else {
        await addCategory({ name: form.name })
        setSuccess("Category added successfully!")
      }
      setForm({ name: "", _id: null })
      fetchCategories()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save category. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return

    setError("")
    setSuccess("")
    try {
      await deleteCategory(id)
      setSuccess("Category deleted successfully!")
      fetchCategories()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to delete category. Please try again.")
    }
  }

  function handleCancel() {
    setForm({ name: "", _id: null })
    setError("")
    setSuccess("")
  }

  // Filter categories based on search term
  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="dashboard-layout-admin">
      <Sidebar role="admin" />
      <main className="dashboard-main-admin">
        <div className="category-container-admin">
          {/* Header */}
          <div className="category-header-admin">
            <div className="header-content-admin">
              <h2 className="category-title-admin">
                <FaTags className="title-icon-admin" />
                Manage Categories
              </h2>
              <p className="category-subtitle-admin">
                Add, edit, and organize product categories for your agricultural platform
              </p>
            </div>
            <div className="header-stats-admin">
              <div className="stat-item-admin">
                <span className="stat-number-admin">{categories.length}</span>
                <span className="stat-label-admin">Total Categories</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="success-message-admin">
              <FaCheck className="success-icon-admin" />
              <span>{success}</span>
              <button className="dismiss-btn-admin" onClick={() => setSuccess("")}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message-admin">
              <FaExclamationTriangle className="error-icon-admin" />
              <span>{error}</span>
              <button className="dismiss-btn-admin" onClick={() => setError("")}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* Category Form */}
          <div className="form-container-admin">
            <div className="form-header-admin">
              <h3 className="form-title-admin">
                {form._id ? (
                  <>
                    <FaEdit className="form-icon-admin" /> Edit Category
                  </>
                ) : (
                  <>
                    <FaPlus className="form-icon-admin" /> Add New Category
                  </>
                )}
              </h3>
            </div>
            <form className="category-form-admin" onSubmit={handleSubmit}>
              <div className="form-group-admin">
                <label htmlFor="name" className="form-label-admin">
                  <FaTags className="input-icon-admin" />
                  Category Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="form-input-admin"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-actions-admin">
                <button type="submit" className="submit-btn-admin" disabled={submitting}>
                  {submitting ? (
                    <>
                      <FaSpinner className="spinner-icon-admin" />
                      {form._id ? "Updating..." : "Adding..."}
                    </>
                  ) : form._id ? (
                    <>
                      <FaCheck /> Update Category
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Category
                    </>
                  )}
                </button>
                {form._id && (
                  <button type="button" className="cancel-btn-admin" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="categories-list-container-admin">
            <div className="list-header-admin">
              <h3 className="list-title-admin">
                <FaLayerGroup className="list-icon-admin" />
                Categories List
              </h3>
              <div className="search-container-admin">
                <FaSearch className="search-icon-admin" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-admin"
                />
              </div>
            </div>

            {loading ? (
              <div className="loading-state-admin">
                <FaSpinner className="loading-spinner-admin" />
                <h3>Loading Categories...</h3>
                <p>Fetching category data</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="empty-state-admin">
                <FaTags className="empty-icon-admin" />
                <h3>No Categories Found</h3>
                <p>You haven't added any categories yet. Use the form above to add your first category.</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="no-results-admin">
                <FaSearch className="no-results-icon-admin" />
                <h3>No matching categories</h3>
                <p>Try adjusting your search term</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="table-container-admin">
                  <table className="category-table-admin">
                    <thead>
                      <tr>
                        <th className="name-header-admin">
                          <FaTags className="th-icon-admin" />
                          Category Name
                        </th>
                        <th className="products-header-admin">Products Count</th>
                        <th className="actions-header-admin">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((cat, index) => (
                        <tr key={cat._id || index} className="category-row-admin">
                          <td className="name-cell-admin">
                            <div className="category-name-admin">
                              <div className="category-icon-wrapper-admin">
                                <FaTags className="category-icon-admin" />
                              </div>
                              <span className="category-text-admin">{cat.name}</span>
                            </div>
                          </td>
                          <td className="products-cell-admin">
                            <span className="products-count-admin">{cat.productCount || 0} products</span>
                          </td>
                          <td className="actions-cell-admin">
                            <div className="action-buttons-admin">
                              <button className="edit-btn-admin" onClick={() => handleEdit(cat)} title="Edit category">
                                <FaEdit /> Edit
                              </button>
                              <button
                                className="delete-btn-admin"
                                onClick={() => handleDelete(cat._id)}
                                title="Delete category"
                              >
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
                <div className="mobile-categories-admin">
                  {filteredCategories.map((cat, index) => (
                    <div key={cat._id || index} className="category-card-admin">
                      <div className="card-header-admin">
                        <div className="category-info-admin">
                          <div className="category-icon-wrapper-admin">
                            <FaTags className="category-icon-admin" />
                          </div>
                          <div className="category-details-admin">
                            <h4 className="card-title-admin">{cat.name}</h4>
                            <span className="card-products-admin">{cat.productCount || 0} products</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-actions-admin">
                        <button className="mobile-edit-btn-admin" onClick={() => handleEdit(cat)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="mobile-delete-btn-admin" onClick={() => handleDelete(cat._id)}>
                          <FaTrash /> Delete
                        </button>
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
