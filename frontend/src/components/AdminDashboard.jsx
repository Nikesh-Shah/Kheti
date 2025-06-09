import React, { useEffect, useState } from "react"
import { getAllUsers, getAllOrders, getProducts } from "../api/api"
import { FaUsers, FaBox, FaClipboardList, FaRupeeSign, FaSpinner, FaChartBar } from "react-icons/fa"
import Sidebar from "./Sidebar"
import "../Styles/AdminDashboard.css"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError("")
      try {
        const [userRes, productRes, orderRes] = await Promise.all([
          getAllUsers(),
          getProducts(),
          getAllOrders(),
        ])
        setUsers(userRes.data || [])
        setProducts(productRes.data || [])
        setOrders(orderRes.data || [])
      } catch (err) {
        setError("Failed to load admin data.")
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Stats
  const totalUsers = users.length
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <h1 className="dashboard-title">
            <FaChartBar style={{ marginRight: 8 }} />
            Admin Dashboard
          </h1>
          {loading ? (
            <div className="dashboard-loading">
              <FaSpinner className="loading-spinner" spin="true" />
              <h3>Loading Dashboard...</h3>
            </div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card users">
                  <FaUsers className="stat-icon" />
                  <div>
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                </div>
                <div className="stat-card products">
                  <FaBox className="stat-icon" />
                  <div>
                    <div className="stat-value">{totalProducts}</div>
                    <div className="stat-label">Products</div>
                  </div>
                </div>
                <div className="stat-card orders">
                  <FaClipboardList className="stat-icon" />
                  <div>
                    <div className="stat-value">{totalOrders}</div>
                    <div className="stat-label">Orders</div>
                  </div>
                </div>
                <div className="stat-card earnings">
                  <FaRupeeSign className="stat-icon" />
                  <div>
                    <div className="stat-value">
                      ₹{totalEarnings.toLocaleString("en-IN")}
                    </div>
                    <div className="stat-label">Total Earnings</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Users</h2>
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(-5).reverse().map((user) => (
                        <tr key={user._id || user.id}>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Orders</h2>
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(-5).reverse().map((order) => (
                        <tr key={order._id || order.id}>
                          <td>{order._id || order.id}</td>
                          <td>{order.user?.firstName} {order.user?.lastName}</td>
                          <td>₹{order.total?.toLocaleString("en-IN")}</td>
                          <td>{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}