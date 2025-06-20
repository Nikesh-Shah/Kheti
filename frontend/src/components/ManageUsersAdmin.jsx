"use client"

import { useEffect, useState } from "react"
import { getAllUsers, updateUser, deleteUser } from "../api/api"
import "../Styles/ManageUsersAdmin.css"
import Sidebar from "./Sidebar" // Import the Sidebar component

export default function ManageUsersAdmin() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  async function fetchUsers() {
    setLoading(true)
    setError("")
    try {
      const res = await getAllUsers()
      setUsers(res.data || [])
    } catch (err) {
      setError("Failed to fetch users.")
    }
    setLoading(false)
  }

  function filterUsers() {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  function handleEdit(user) {
    setEditingUser(user)
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "",
    })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      await updateUser(editingUser._id, form)
      setSuccess("User updated successfully!")
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      setError("Failed to update user.")
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    setError("")
    setSuccess("")
    try {
      await deleteUser(id)
      setSuccess("User deleted successfully!")
      fetchUsers()
    } catch (err) {
      setError("Failed to delete user.")
    }
  }

  function dismissMessage() {
    setError("")
    setSuccess("")
  }

  function getUserInitials(firstName, lastName) {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "?"
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="manage-users-admin">
        <div className="users-loading">
          <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            ></path>
          </svg>
          <h3>Loading Users</h3>
          <p>Please wait while we fetch the user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      {/* Add the Sidebar component */}
      <Sidebar role="admin" />
      
      <main className="dashboard-main">
        <div className="manage-users-admin">
          {/* Header */}
          <div className="manage-users-header">
            <h2>
              <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Manage Users
            </h2>
          </div>

          {/* Controls */}
          <div className="users-controls">
            <div className="search-container">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="role-filter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="farmer">Farmers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Messages */}
          {success && (
            <div className="message message-success">
              <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {success}
              <button className="message-dismiss" onClick={dismissMessage}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {error && (
            <div className="message message-error">
              <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
              <button className="message-dismiss" onClick={dismissMessage}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Desktop Table */}
          <div className="users-table-container">
            <div className="table-header">
              <h3 className="table-title">
                <svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
                  />
                </svg>
                User Directory
              </h3>
              <p className="table-subtitle">Manage all registered users, farmers, and administrators</p>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="empty-title">No users found</h3>
                <p className="empty-description">
                  {searchTerm || roleFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "There are no users registered in the system yet."}
                </p>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{getUserInitials(user.firstName, user.lastName)}</div>
                              <div className="user-details">
                                <div className="user-name">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="user-email">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge ${user.role}`}>{user.role}</span>
                          </td>
                          <td>
                            <span className="role-badge active">Active</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>
                                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                              <button className="action-btn delete-btn" onClick={() => handleDelete(user._id)}>
                                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>

                    <div className="pagination-info">
                      Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                      {filteredUsers.length} users
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="users-cards">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">{getUserInitials(user.firstName, user.lastName)}</div>
                  <div className="user-card-info">
                    <div className="user-card-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="user-card-email">{user.email}</div>
                  </div>
                </div>
                <div className="user-card-role">
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
                <div className="user-card-actions">
                  <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(user._id)}>
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit User Modal */}
          {editingUser && (
            <div className="edit-form-overlay" onClick={(e) => e.target === e.currentTarget && setEditingUser(null)}>
              <div className="edit-form-container">
                <div className="edit-form-header">
                  <h3 className="edit-form-title">
                    <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit User
                  </h3>
                </div>
                <div className="edit-form-content">
                  <form onSubmit={handleUpdate} className="edit-user-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="form-inputadmin"
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="form-inputadmin"
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-inputadmin"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select name="role" value={form.role} onChange={handleChange} className="form-select" required>
                        <option value="">Select a role</option>
                        <option value="user">User</option>
                        <option value="farmer">Farmer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="form-btn form-btn-secondary" onClick={() => setEditingUser(null)}>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                      <button type="submit" className="form-btn form-btn-primary">
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
