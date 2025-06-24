"use client"

import { useEffect, useState } from "react"
import { getAllUsers, getAllOrders, getProducts } from "../api/api"
import {
  FaUsers,
  FaBox,
  FaClipboardList,
  FaRupeeSign,
  FaSpinner,
  FaCalendarAlt,
  FaSmile,
  FaExclamationTriangle,
    FaShieldAlt,
} from "react-icons/fa"
import Sidebar from "./Sidebar"
import "../Styles/AdminDashboard.css" 

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [adminName, setAdminName] = useState("Administrator")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError("")
      try {
        const [userRes, productRes, orderRes] = await Promise.all([getAllUsers(), getProducts(), getAllOrders()])
        setUsers(userRes.data || [])
        setProducts(productRes.data?.products || productRes.data || [])
        setOrders(orderRes.data || [])

        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
        let user = null
        try {
          user = userStr ? JSON.parse(userStr) : null
        } catch {
          user = null
        }
        setAdminName(user?.firstName || "Administrator")
      } catch (err) {
        setError("Failed to load admin data.")
        setUsers([])
        setProducts([])
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalUsers = users.length
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const monthlyOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt || o.date)
    const currentMonth = new Date().getMonth()
    return orderDate.getMonth() === currentMonth
  }).length

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName={adminName} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">
                  <FaSmile className="title-icon" />
                  Welcome back, {adminName}!
                </h1>
                <p className="dashboard-subtitle">
                  Monitor and manage your agricultural platform from this comprehensive admin dashboard.
                </p>
              </div>
              <div className="header-date">
                <FaCalendarAlt className="date-icon" />
                <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              <FaSpinner className="loading-spinner" />
              <h3>Loading Dashboard...</h3>
              <p>Fetching platform analytics and data</p>
            </div>
          ) : error ? (
            <div className="dashboard-error">
              <FaExclamationTriangle className="error-icon" />
              <h3>Error Loading Dashboard</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : (
            <div className="dashboard-content">
              <div className="stats-grid">
                <div className="stat-card users">
                  <div className="stat-icon-container">
                    <FaUsers className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-change positive">+{Math.floor(totalUsers * 0.1)} this month</div>
                  </div>
                </div>

                <div className="stat-card products">
                  <div className="stat-icon-container">
                    <FaBox className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{totalProducts}</div>
                    <div className="stat-label">Products Listed</div>
                    <div className="stat-change positive">+{Math.floor(totalProducts * 0.05)} this week</div>
                  </div>
                </div>

                <div className="stat-card orders">
                  <div className="stat-icon-container">
                    <FaClipboardList className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-change positive">{monthlyOrders} this month</div>
                  </div>
                </div>

                <div className="stat-card earnings">
                  <div className="stat-icon-container">
                    <FaRupeeSign className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{formatCurrency(totalEarnings)}</div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-change positive">+12% from last month</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaUsers className="card-icon" />
                      Recent Users
                    </h3>
                    <p className="card-subtitle">Latest registered users on the platform</p>
                  </div>
                  <div className="table-container">
                    {users.length === 0 ? (
                      <div className="empty-state">
                        <FaUsers className="empty-icon" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users
                            .slice(-5)
                            .reverse()
                            .map((user, index) => (
                              <tr key={user._id || user.id || index}>
                                <td className="user-name">
                                  <div className="user-avatar">
                                    {user.role === "admin" ? <  FaShieldAlt /> : <FaUsers />}
                                  </div>
                                  <span>
                                    {user.firstName} {user.lastName}
                                  </span>
                                </td>
                                <td className="user-email">{user.email}</td>
                                <td className="user-role">
                                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                                </td>
                                <td className="user-status">
                                  <span className="status-badge active">Active</span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaClipboardList className="card-icon" />
                      Recent Orders
                    </h3>
                    <p className="card-subtitle">Latest orders placed on the platform</p>
                  </div>
                  <div className="table-container">
                    {orders.length === 0 ? (
                      <div className="empty-state">
                        <FaClipboardList className="empty-icon" />
                        <p>No orders found</p>
                      </div>
                    ) : (
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .slice(-5)
                            .reverse()
                            .map((order, index) => (
                              <tr key={order._id || order.id || index}>
                                <td className="order-id">
                                  <span className="id-text">#{(order._id || order.id || `ORD${index}`).slice(-8)}</span>
                                </td>
                                <td className="order-customer">
                                  {order.user?.firstName} {order.user?.lastName} {order.customerName || "N/A"}
                                </td>
                                <td className="order-total">
                                  <span className="total-amount">{formatCurrency(order.total || 0)}</span>
                                </td>
                                <td className="order-status">
                                  <span className={`status-badge ${order.status || "pending"}`}>
                                    {order.status || "pending"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {pendingOrders > 0 && (
                <div className="dashboard-card alert-card">
                  <div className="card-header">
                    <h3 className="card-title alert-title">
                      <FaExclamationTriangle className="card-icon alert-icon" />
                      Attention Required
                    </h3>
                    <p className="card-subtitle">Orders that need immediate attention</p>
                  </div>
                  <div className="alert-content">
                    <div className="alert-item">
                      <div className="alert-info">
                        <div className="alert-text">You have {pendingOrders} pending orders</div>
                        <div className="alert-subtext">These orders are waiting for processing</div>
                      </div>
                      <button className="action-btn">View Orders</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
