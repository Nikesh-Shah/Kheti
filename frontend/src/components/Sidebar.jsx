"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LuHouse, // Use LuHouse instead of LuHome
  LuPackage,
  LuClipboardList,
  LuUsers,
  LuLayers,
  LuSprout,
  LuMenu,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuUser,
  LuShield,

} from "react-icons/lu"
import "../Styles/Sidebar.css" // Ensure you have the correct path to your CSS file

export default function Sidebar({ role, userName = "John Doe" }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Define sidebar links for each role
  const links =
    role === "admin"
      ? [
          { to: "/admin", icon: <LuHouse />, label: "Dashboard" },
          { to: "/admin/manage-products", icon: <LuPackage />, label: "Manage Products" },
          { to: "/admin/manage-users", icon: <LuUsers />, label: "Manage Users" },
          { to: "/admin/manage-categories", icon: <LuLayers />, label: "Manage Categories" },
        ]
      : [
          { to: "/farmer", icon: <LuHouse />, label: "Dashboard" },
          { to: "/farmer/manage-products", icon: <LuPackage />, label: "My Products" },
          { to: "/farmer/manage-orders", icon: <LuClipboardList />, label: "My Orders" },
        ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const closeMobile = () => {
    setIsMobileOpen(false)
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/auth")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobile}>
        {isMobileOpen ? <LuX /> : <LuMenu />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && <div className="mobile-overlay" onClick={closeMobile}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <LuSprout />
            </div>
            {!isCollapsed && <span className="logo-text">AgriConnect</span>}
          </div>
          <button className="collapse-btn desktop-only" onClick={toggleCollapse}>
            {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">{role === "admin" ? <LuShield /> : <LuUser />}</div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{role === "admin" ? "Administrator" : "Farmer"}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.to} className="nav-item">
                <Link
                  to={link.to}
                  className={`nav-link-sidebar ${location.pathname === link.to ? "active" : ""}`}
                  onClick={closeMobile}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {!isCollapsed && <span className="nav-label">{link.label}</span>}
                </Link>
              </li>
            ))}
            {/* Logout Button */}
            <li className="nav-item">
              <button
                className="nav-link-sidebar"
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                onClick={handleLogout}
              >
                <span className="nav-icon"><LuX /></span>
                {!isCollapsed && <span className="nav-label">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="footer-content">
              <p className="footer-text">AgriConnect Dashboard</p>
              <p className="footer-version">v2.0.1</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
