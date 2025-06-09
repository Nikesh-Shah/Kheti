"use client"

import { useEffect, useState } from "react"
import { getFarmerOrders, updateOrderStatus } from "../../api/api"
import {
  FaClipboardList,
  FaSpinner,
  FaExclamationTriangle,
  FaShoppingCart,
  FaUser,
  FaCalendarAlt,
  FaRupeeSign,
  FaShippingFast,
  FaTimes,
  FaCheck,
  FaEye,
  FaBox,
} from "react-icons/fa"
import Sidebar from "../Sidebar"
import "../../Styles/ManageOrderFarmer.css"

export default function ManageOrderFarmer() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [updatingOrder, setUpdatingOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    setFetchError("")
    try {
      const res = await getFarmerOrders()
      setOrders(res.data || [])
    } catch (err) {
      setOrders([])
      setFetchError("Failed to fetch orders.")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(orderId, status) {
    setUpdatingOrder(orderId)
    try {
      await updateOrderStatus(orderId, status)
      await fetchOrders()
    } catch {
      alert("Failed to update order status")
    } finally {
      setUpdatingOrder(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { icon: <FaClipboardList />, class: "status-pending" },
      shipped: { icon: <FaShippingFast />, class: "status-shipped" },
      delivered: { icon: <FaCheck />, class: "status-delivered" },
      cancelled: { icon: <FaTimes />, class: "status-cancelled" },
    }
    const config = statusConfig[status] || { icon: <FaBox />, class: "status-default" }
    return (
      <span className={`status-badge ${config.class}`}>
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

  return (
    <div className="dashboard-layout">
      <Sidebar role="farmer" />
      <main className="dashboard-main">
        <div className="orders-container">
          {/* Header */}
          <div className="orders-header">
            <div className="header-content">
              <h2 className="orders-title">
                <FaClipboardList className="title-icon" />
                Manage My Orders
              </h2>
              <p className="orders-subtitle">Track and manage all your customer orders in one place</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{orders.filter((o) => o.status === "pending").length}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="loading-state">
              <FaSpinner className="loading-spinner" />
              <h3>Loading Orders...</h3>
              <p>Fetching your order data</p>
            </div>
          ) : fetchError ? (
            <div className="error-state">
              <FaExclamationTriangle className="error-icon" />
              <h3>Error Loading Orders</h3>
              <p>{fetchError}</p>
              <button className="retry-btn" onClick={fetchOrders}>
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <FaShoppingCart className="empty-icon" />
              <h3>No Orders Found</h3>
              <p>You haven't received any orders yet. Orders will appear here once customers place them.</p>
            </div>
          ) : (
            <div className="orders-content">
              {/* Desktop Table */}
              <div className="table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>
                        <FaBox className="th-icon" />
                        Order ID
                      </th>
                      <th>
                        <FaShoppingCart className="th-icon" />
                        Products
                      </th>
                      <th>
                        <FaRupeeSign className="th-icon" />
                        Total
                      </th>
                      <th>Status</th>
                      <th>
                        <FaUser className="th-icon" />
                        Customer
                      </th>
                      <th>
                        <FaCalendarAlt className="th-icon" />
                        Placed On
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="order-row">
                        <td className="order-id">
                          <span className="id-text">#{order._id.slice(-8)}</span>
                        </td>
                        <td className="order-products">
                          <div className="products-list">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="product-item">
                                <span className="product-name">{item.name || item.title}</span>
                                <span className="product-quantity">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="order-total">
                          <span className="total-amount">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="order-status">{getStatusBadge(order.status)}</td>
                        <td className="order-customer">
                          <span className="customer-name">{order.customerName || order.customer?.name || "N/A"}</span>
                        </td>
                        <td className="order-date">
                          <span className="date-text">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}
                          </span>
                        </td>
                        <td className="order-actions">
                          <div className="action-buttons">
                            {order.status === "pending" && (
                              <>
                                <button
                                  className="action-btn ship-btn"
                                  onClick={() => handleStatusChange(order._id, "shipped")}
                                  disabled={updatingOrder === order._id}
                                >
                                  {updatingOrder === order._id ? (
                                    <FaSpinner className="btn-spinner" />
                                  ) : (
                                    <FaShippingFast />
                                  )}
                                  Ship
                                </button>
                                <button
                                  className="action-btn cancel-btn"
                                  onClick={() => handleStatusChange(order._id, "cancelled")}
                                  disabled={updatingOrder === order._id}
                                >
                                  <FaTimes />
                                  Cancel
                                </button>
                              </>
                            )}
                            {order.status === "shipped" && (
                              <button
                                className="action-btn deliver-btn"
                                onClick={() => handleStatusChange(order._id, "delivered")}
                                disabled={updatingOrder === order._id}
                              >
                                {updatingOrder === order._id ? <FaSpinner className="btn-spinner" /> : <FaCheck />}
                                Deliver
                              </button>
                            )}
                            {(order.status === "delivered" || order.status === "cancelled") && (
                              <button className="action-btn view-btn">
                                <FaEye />
                                View
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="mobile-orders">
                {orders.map((order) => (
                  <div key={order._id} className="mobile-order-card">
                    <div className="card-header">
                      <div className="order-info">
                        <span className="mobile-order-id">#{order._id.slice(-8)}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="mobile-total">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="card-content">
                      <div className="customer-info">
                        <FaUser className="info-icon" />
                        <span>{order.customerName || order.customer?.name || "N/A"}</span>
                      </div>
                      <div className="date-info">
                        <FaCalendarAlt className="info-icon" />
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}</span>
                      </div>
                      <div className="products-info">
                        <FaShoppingCart className="info-icon" />
                        <div className="mobile-products">
                          {(order.items || []).map((item, idx) => (
                            <span key={idx} className="mobile-product">
                              {item.name || item.title} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="card-actions">
                      {order.status === "pending" && (
                        <>
                          <button
                            className="mobile-action-btn ship-btn"
                            onClick={() => handleStatusChange(order._id, "shipped")}
                            disabled={updatingOrder === order._id}
                          >
                            {updatingOrder === order._id ? <FaSpinner className="btn-spinner" /> : <FaShippingFast />}
                            Ship Order
                          </button>
                          <button
                            className="mobile-action-btn cancel-btn"
                            onClick={() => handleStatusChange(order._id, "cancelled")}
                            disabled={updatingOrder === order._id}
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === "shipped" && (
                        <button
                          className="mobile-action-btn deliver-btn"
                          onClick={() => handleStatusChange(order._id, "delivered")}
                          disabled={updatingOrder === order._id}
                        >
                          {updatingOrder === order._id ? <FaSpinner className="btn-spinner" /> : <FaCheck />}
                          Mark Delivered
                        </button>
                      )}
                      {(order.status === "delivered" || order.status === "cancelled") && (
                        <button className="mobile-action-btn view-btn">
                          <FaEye />
                          View Details
                        </button>
                      )}
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
