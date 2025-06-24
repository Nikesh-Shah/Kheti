"use client"

import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus, deleteOrder } from "../api/api"
import {
  FaClipboardList,
  FaSpinner,
  FaExclamationTriangle,
  FaShoppingCart,
  FaUser,
  FaCalendarAlt,
  FaRupeeSign,
  FaTimes,
  FaCheck,
  FaEye,
  FaBox,
  FaSearch,
  FaFilter,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaHourglass,
} from "react-icons/fa"
import Sidebar from "./Sidebar"
import "../Styles/ManageOrdersAdmin.css"

export default function ManageOrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setError("")
    try {
      const res = await getAllOrders()
      setOrders(res.data || [])
    } catch (err) {
      setError("Failed to fetch orders. Please try again.")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId, status) {
    setError("")
    setSuccess("")
    setUpdatingOrder(orderId)
    try {
      await updateOrderStatus(orderId, { status })
      setSuccess("Order status updated successfully!")
      fetchOrders()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to update order status.")
    } finally {
      setUpdatingOrder(null)
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return

    setError("")
    setSuccess("")
    try {
      await deleteOrder(orderId)
      setSuccess("Order deleted successfully!")
      fetchOrders()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to delete order.")
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case "highest":
          return (b.total || 0) - (a.total || 0)
        case "lowest":
          return (a.total || 0) - (b.total || 0)
        default:
          return 0
      }
    })

  const getStatusIcon = (status) => {
    const statusConfig = {
      pending: { icon: <FaClock />, class: "status-pending-admin" },
      processing: { icon: <FaHourglass />, class: "status-processing-admin" },
      shipped: { icon: <FaTruck />, class: "status-shipped-admin" },
      delivered: { icon: <FaCheckCircle />, class: "status-delivered-admin" },
      cancelled: { icon: <FaTimesCircle />, class: "status-cancelled-admin" },
    }
    const config = statusConfig[status] || { icon: <FaBox />, class: "status-default-admin" }
    return (
      <span className={`status-badge-admin ${config.class}`}>
        {config.icon}
        {status}
      </span>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getOrderStats = () => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === "pending").length
    const processing = orders.filter((o) => o.status === "processing").length
    const shipped = orders.filter((o) => o.status === "shipped").length
    const delivered = orders.filter((o) => o.status === "delivered").length
    const cancelled = orders.filter((o) => o.status === "cancelled").length

    return { total, pending, processing, shipped, delivered, cancelled }
  }

  const stats = getOrderStats()

  return (
    <div className="dashboard-layout-orders-admin">
      <Sidebar role="admin" />
      <main className="dashboard-main-orders-admin">
        <div className="orders-container-admin">
          <div className="orders-header-admin">
            <div className="header-content-orders-admin">
              <h2 className="orders-title-admin">
                <FaClipboardList className="title-icon-orders-admin" />
                Manage Orders
              </h2>
              <p className="orders-subtitle-admin">
                Monitor, update, and manage all customer orders from your agricultural platform
              </p>
            </div>
            <div className="header-stats-orders-admin">
              <div className="stat-item-orders-admin">
                <span className="stat-number-orders-admin">{stats.total}</span>
                <span className="stat-label-orders-admin">Total Orders</span>
              </div>
              <div className="stat-item-orders-admin">
                <span className="stat-number-orders-admin">{stats.pending}</span>
                <span className="stat-label-orders-admin">Pending</span>
              </div>
              <div className="stat-item-orders-admin">
                <span className="stat-number-orders-admin">{stats.delivered}</span>
                <span className="stat-label-orders-admin">Delivered</span>
              </div>
            </div>
          </div>

          {success && (
            <div className="success-message-orders-admin">
              <FaCheck className="success-icon-orders-admin" />
              <span>{success}</span>
              <button className="dismiss-btn-orders-admin" onClick={() => setSuccess("")}>
                <FaTimes />
              </button>
            </div>
          )}

          {error && (
            <div className="error-message-orders-admin">
              <FaExclamationTriangle className="error-icon-orders-admin" />
              <span>{error}</span>
              <button className="dismiss-btn-orders-admin" onClick={() => setError("")}>
                <FaTimes />
              </button>
            </div>
          )}

          <div className="filters-container-admin">
            <div className="search-container-orders-admin">
              <FaSearch className="search-icon-orders-admin" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-orders-admin"
              />
            </div>

            <div className="filter-group-admin">
              <div className="filter-item-admin">
                <FaFilter className="filter-icon-admin" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select-admin"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="filter-item-admin">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select-admin">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>

          <div className="results-info-admin">
            <span className="results-count-admin">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          {loading ? (
            <div className="loading-state-orders-admin">
              <FaSpinner className="loading-spinner-orders-admin" />
              <h3>Loading Orders...</h3>
              <p>Fetching order data from the platform</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state-orders-admin">
              <FaShoppingCart className="empty-icon-orders-admin" />
              <h3>No Orders Found</h3>
              <p>No orders have been placed yet. Orders will appear here once customers start purchasing.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="no-results-orders-admin">
              <FaSearch className="no-results-icon-orders-admin" />
              <h3>No matching orders</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="orders-content-admin">
              <div className="table-container-orders-admin">
                <table className="orders-table-admin">
                  <thead>
                    <tr>
                      <th>
                        <FaBox className="th-icon-orders-admin" />
                        Order ID
                      </th>
                      <th>
                        <FaUser className="th-icon-orders-admin" />
                        Customer
                      </th>
                      <th>
                        <FaRupeeSign className="th-icon-orders-admin" />
                        Total Amount
                      </th>
                      <th>Status</th>
                      <th>
                        <FaCalendarAlt className="th-icon-orders-admin" />
                        Order Date
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="order-row-admin">
                        <td className="order-id-admin">
                          <span className="id-text-admin">#{order._id?.slice(-8) || "N/A"}</span>
                        </td>
                        <td className="customer-cell-admin">
                          <div className="customer-info-admin">
                            <div className="customer-avatar-admin">
                              <FaUser />
                            </div>
                            <div className="customer-details-admin">
                              <span className="customer-name-admin">
                                {order.user?.firstName
                                  ? `${order.user.firstName} ${order.user.lastName || ""}`
                                  : "Unknown Customer"}
                              </span>
                              <span className="customer-email-admin">{order.user?.email || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="total-cell-admin">
                          <span className="total-amount-admin">{formatCurrency(order.total || 0)}</span>
                        </td>
                        <td className="status-cell-admin">
                          <select
                            value={order.status || "pending"}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="status-select-admin"
                            disabled={updatingOrder === order._id}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingOrder === order._id && <FaSpinner className="updating-spinner-admin" />}
                        </td>
                        <td className="date-cell-admin">
                          <span className="date-text-admin">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}
                          </span>
                          <span className="time-text-admin">
                            {order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN") : ""}
                          </span>
                        </td>
                        <td className="actions-cell-admin">
                          <div className="action-buttons-orders-admin">
                            <button className="view-btn-admin" title="View order details">
                              <FaEye />
                            </button>
                            <button
                              className="delete-btn-orders-admin"
                              onClick={() => handleDelete(order._id)}
                              title="Delete order"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-orders-admin">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="order-card-admin">
                    <div className="card-header-orders-admin">
                      <div className="order-info-admin">
                        <span className="mobile-order-id-admin">#{order._id?.slice(-8) || "N/A"}</span>
                        {getStatusIcon(order.status || "pending")}
                      </div>
                      <span className="mobile-total-admin">{formatCurrency(order.total || 0)}</span>
                    </div>
                    <div className="card-content-orders-admin">
                      <div className="customer-info-mobile-admin">
                        <FaUser className="info-icon-admin" />
                        <div className="customer-details-mobile-admin">
                          <span className="mobile-customer-name-admin">
                            {order.user?.firstName
                              ? `${order.user.firstName} ${order.user.lastName || ""}`
                              : "Unknown Customer"}
                          </span>
                          <span className="mobile-customer-email-admin">{order.user?.email || "N/A"}</span>
                        </div>
                      </div>
                      <div className="date-info-admin">
                        <FaCalendarAlt className="info-icon-admin" />
                        <div className="date-details-admin">
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}</span>
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN") : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-actions-orders-admin">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="mobile-status-select-admin"
                        disabled={updatingOrder === order._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="mobile-action-buttons-admin">
                        <button className="mobile-view-btn-admin">
                          <FaEye /> View
                        </button>
                        <button className="mobile-delete-btn-admin" onClick={() => handleDelete(order._id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
