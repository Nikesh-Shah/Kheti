
import { useState, useRef, useEffect } from "react"
import {
  LuHouse,
  LuPackage,
  LuShoppingCart,
  LuUser,
  LuUserRound,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css"
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
  );
  const dropdownRef = useRef(null)
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(!!(localStorage.getItem('token') || sessionStorage.getItem('token')));
    };
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleDropdownItemClick = (action) => {
    setIsDropdownOpen(false);
    if (action === "Logout") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.dispatchEvent(new Event('auth-changed'));
      navigate("/auth");
    }
    if (action === "Profile") {
      navigate("/profile");
    }
    if (action === "Settings") {
      navigate("/settings");
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" style={{ textDecoration: "none" }}>
          <div className="logo-icon-container">
            <LuPackage className="logo-icon" />
          </div>
          <span className="logo-text">Kheti</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link active">
            <LuHouse className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/product" className="nav-link">
            <LuPackage className="nav-icon" />
            <span>Products</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <LuShoppingCart className="nav-icon" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
              <Link to="/orders" className="nav-link">
                <LuPackage className="nav-icon" />
                <span>Orders</span>
              </Link>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/auth" className="nav-link">
                <LuUser className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link">
                <LuUserRound className="nav-icon" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        {isLoggedIn && (
          <div className="navbar-user" ref={dropdownRef}>
            <button className="user-button" onClick={toggleDropdown}>
              <LuUser className="user-icon" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-arrow"></div>
                <button className="dropdown-item" onClick={() => handleDropdownItemClick("Profile")}>
                  <LuUser className="dropdown-icon" />
                  <span>Profile</span>
                </button>
                <button className="dropdown-item" onClick={() => handleDropdownItemClick("Settings")}>
                  <LuSettings className="dropdown-icon" />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={() => handleDropdownItemClick("Logout")}>
                  <LuLogOut className="dropdown-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <LuX className="mobile-menu-icon" /> : <LuMenu className="mobile-menu-icon" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link active">
            <LuHouse className="mobile-nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/product" className="mobile-nav-link">
            <LuPackage className="mobile-nav-icon" />
            <span>Products</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/cart" className="mobile-nav-link">
                <LuShoppingCart className="mobile-nav-icon" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="mobile-cart-badge">{cartCount}</span>
                )}
              </Link>
              <Link to="/orders" className="mobile-nav-link">
                <LuPackage className="mobile-nav-icon" />
                <span>Orders</span>
              </Link>
            </>
          )}
          {/* Show Login/Register for guests in mobile menu */}
          {!isLoggedIn && (
            <>
              <Link to="/auth" className="mobile-nav-link">
                <LuUser className="mobile-nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="mobile-nav-link">
                <LuUserRound className="mobile-nav-icon" />
                <span>Register</span>
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <div className="mobile-divider"></div>
              <button className="mobile-nav-link" onClick={() => handleDropdownItemClick("Profile")}>
                <LuUserRound className="mobile-nav-icon" />
                <span>Profile</span>
              </button>
              <button className="mobile-nav-link" onClick={() => handleDropdownItemClick("Settings")}>
                <LuSettings className="mobile-nav-icon" />
                <span>Settings</span>
              </button>
              <button className="mobile-nav-link logout-mobile" onClick={() => handleDropdownItemClick("Logout")}>
                <LuLogOut className="mobile-nav-icon" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
