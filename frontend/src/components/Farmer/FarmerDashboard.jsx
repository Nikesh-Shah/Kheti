"use client"

import { useEffect, useState } from "react"
import { getFarmerProducts, getFarmerOrders } from "../../api/api"
import {
  FaExclamationTriangle, // alert
  FaBox,                // package
  FaClipboardList,      // clipboard
  FaChartLine,          // trending up
  FaSmile,              // smile
  FaRupeeSign,          // rupee
  FaShoppingCart,       // shopping cart
  FaChartBar,           // bar chart
  FaCalendarAlt,        // calendar
  FaSpinner,            // loader
} from "react-icons/fa"
import Sidebar from "../Sidebar"
import { Bar } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js"

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

export default function FarmerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [farmerName, setFarmerName] = useState("Farmer")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [prodRes, orderRes] = await Promise.all([getFarmerProducts(), getFarmerOrders()])
        setProducts(prodRes.data || [])
        setOrders(orderRes.data || [])
        const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
        let user = null
        try {
          user = userStr ? JSON.parse(userStr) : null
        } catch {
          user = null
        }
        setFarmerName(user?.firstName || "Farmer")
      } catch {
        setProducts([])
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Quick stats
  const totalProducts = products.length
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const earnings = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const monthlyEarnings = orders
    .filter((o) => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + (o.total || 0), 0)

  // Top-selling products (by order count)
  const productSales = {}
  orders.forEach((order) => {
    ;(order.items || []).forEach((item) => {
      productSales[item.product] = (productSales[item.product] || 0) + item.quantity
    })
  })
  const topProducts = products
    .map((p) => ({
      ...p,
      sales: productSales[p._id] || 0,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3)

  // Inventory alerts (low stock)
  const lowStock = products.filter((p) => p.quantity <= 10)

  // --- Graph Data ---
  // Sales per month (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return d.toLocaleString("default", { month: "short" })
  })

  const salesPerMonth = months.map((_, idx) => {
    const now = new Date()
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + idx, 1)
    const month = monthDate.getMonth()
    const year = monthDate.getFullYear()
    return orders
      .filter((o) => {
        const d = new Date(o.createdAt)
        return d.getMonth() === month && d.getFullYear() === year
      })
      .reduce((sum, o) => sum + (o.total || 0), 0)
  })

  const salesData = {
    labels: months,
    datasets: [
      {
        label: "Sales (₹)",
        data: salesPerMonth,
        backgroundColor: "rgba(0, 128, 0, 0.8)",
        borderColor: "#008000",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#008000",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#6b7280",
          font: { size: 12 },
        },
        grid: {
          color: "#f3f4f6",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
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
      <Sidebar role="farmer" userName={farmerName} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">
                  <FaSmile className="title-icon" />
                  Welcome back, {farmerName}!
                </h1>
                <p className="dashboard-subtitle">Here's your farm business overview and performance metrics.</p>
              </div>
              <div className="header-date">
                <FaCalendarAlt className="date-icon" />
                <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              <FaSpinner className="loading-spinner" spin="true" />
              <h3>Loading Dashboard...</h3>
              <p>Fetching your farm data and analytics</p>
            </div>
          ) : (
            <div className="dashboard-content">
              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card products">
                  <div className="stat-icon-container">
                    <FaBox className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{totalProducts}</div>
                    <div className="stat-label">Products Listed</div>
                    <div className="stat-change positive">+2 this week</div>
                  </div>
                </div>

                <div className="stat-card orders">
                  <div className="stat-icon-container">
                    <FaShoppingCart className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-change positive">+{Math.floor(totalOrders * 0.1)} this month</div>
                  </div>
                </div>

                <div className="stat-card earnings">
                  <div className="stat-icon-container">
                    <FaRupeeSign className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{formatCurrency(monthlyEarnings)}</div>
                    <div className="stat-label">Monthly Earnings</div>
                    <div className="stat-change positive">+15% from last month</div>
                  </div>
                </div>

                <div className="stat-card pending">
                  <div className="stat-icon-container">
                    <FaClipboardList className="stat-icon" />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{pendingOrders}</div>
                    <div className="stat-label">Pending Orders</div>
                    <div className="stat-change neutral">Needs attention</div>
                  </div>
                </div>
              </div>

              {/* Charts and Analytics */}
              <div className="dashboard-grid">
                {/* Sales Chart */}
                <div className="dashboard-card chart-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaChartBar className="card-icon" />
                      Sales Analytics
                    </h3>
                    <p className="card-subtitle">Revenue trends over the last 6 months</p>
                  </div>
                  <div className="chart-container">
                    <Bar data={salesData} options={chartOptions} />
                  </div>
                </div>

                {/* Top Products */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaChartLine className="card-icon" />
                      Top Selling Products
                    </h3>
                    <p className="card-subtitle">Your best performing products</p>
                  </div>
                  <div className="top-products-container">
                    {topProducts.length === 0 ? (
                      <div className="empty-state">
                        <FaBox className="empty-icon" />
                        <p>No sales data available yet</p>
                      </div>
                    ) : (
                      <div className="top-products-list">
                        {topProducts.map((product, index) => (
                          <div key={product._id} className="top-product-item">
                            <div className="product-rank">#{index + 1}</div>
                            <div className="product-image">
                              <img
                                src={product.image || "/placeholder.svg?height=50&width=50"}
                                alt={product.title || product.name}
                              />
                            </div>
                            <div className="product-info">
                              <div className="product-name">{product.title || product.name}</div>
                              <div className="product-sales">{product.sales} units sold</div>
                            </div>
                            <div className="product-revenue">{formatCurrency(product.price * product.sales)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory Alerts */}
              {lowStock.length > 0 && (
                <div className="dashboard-card alert-card">
                  <div className="card-header">
                    <h3 className="card-title alert-title">
                      <FaExclamationTriangle className="card-icon alert-icon" />
                      Inventory Alerts
                    </h3>
                    <p className="card-subtitle">Products running low on stock</p>
                  </div>
                  <div className="alert-list">
                    {lowStock.map((product) => (
                      <div key={product._id} className="alert-item">
                        <div className="alert-content">
                          <div className="alert-product-name">{product.title || product.name}</div>
                          <div className="alert-stock">Only {product.quantity} units remaining</div>
                        </div>
                        <button className="restock-btn">Restock</button>
                      </div>
                    ))}
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
