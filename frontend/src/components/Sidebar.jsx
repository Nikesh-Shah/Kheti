
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LuHouse, LuPackage, LuClipboardList, LuUsers, LuLayers, LuSprout,
  LuMenu, LuX, LuChevronLeft, LuChevronRight, LuUser, LuShield
} from "react-icons/lu"
import "../Styles/Sidebar.css"

export default function Sidebar({ role, userName }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const links =
    role === "admin"
      ? [
          { to: "/admin", icon: <LuHouse />, label: "Dashboard" },
          { to: "/admin/manage-orders", icon: <LuClipboardList />, label: "Manage Orders" },
          { to: "/admin/manage-products", icon: <LuPackage />, label: "Manage Products" },
          { to: "/admin/manage-users", icon: <LuUsers />, label: "Manage Users" },
          { to: "/admin/manage-categories", icon: <LuLayers />, label: "Manage Categories" },
        ]
      : [
          { to: "/farmer", icon: <LuHouse />, label: "Dashboard" },
          { to: "/farmer/manage-products", icon: <LuPackage />, label: "My Products" },
          { to: "/farmer/manage-orders", icon: <LuClipboardList />, label: "My Orders" },
        ]

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)
  const closeMobile = () => setIsMobileOpen(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/auth")
  }

  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleMobile}>
        {isMobileOpen ? <LuX /> : <LuMenu />}
      </button>

      {isMobileOpen && <div className="mobile-overlay" onClick={closeMobile}></div>}

      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"><LuSprout /></div>
            {!isCollapsed && <span className="logo-text">Kheti</span>}
          </div>
          <button className="collapse-btn desktop-only" onClick={toggleCollapse}>
            {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{role === "admin" ? <LuShield /> : <LuUser />}</div>
          {!isCollapsed && userName && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{role === "admin" ? "Administrator" : "Farmer"}</span>
            </div>
          )}
        </div>

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

        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="footer-content">
              <p className="footer-text">Kheti Dashboard</p>
              <p className="footer-version">v2.0.1</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
