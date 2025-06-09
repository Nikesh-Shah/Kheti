"use client"

import { useState } from "react"
import { loginUser, registerUser } from "../api/api"
import { LuSprout, LuMail, LuLock, LuUser, LuPhone, LuEye, LuEyeOff } from "react-icons/lu"
import "../Styles/Auth.css"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // LOGIN
        const res = await loginUser({ email: form.email, password: form.password })
        console.log("Login API response:", res.data) // DEBUG
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        console.log("User stored in localStorage:", localStorage.getItem("user")) // DEBUG
        const role = res.data.user?.role
        if (role === "admin") window.location.href = "/admin/dashboard"
        else if (role === "seller" || role === "farmer") window.location.href = "/farmer/dashboard"
        else window.location.href = "/"
      } else {
        // REGISTER
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }
        const res = await registerUser({
          firstName: form.name.split(" ")[0] || "",
          lastName: form.name.split(" ").slice(1).join(" ") || "",
          email: form.email,
          password: form.password,
          phoneNumber: form.phone,
          role: form.role,
        })
        console.log("Register API response:", res.data) // DEBUG
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user))
          console.log("User stored in localStorage after register:", localStorage.getItem("user")) // DEBUG
        }
        alert("Registration successful! Please login.")
        setIsLogin(true)
        setForm({ name: "", email: "", password: "", confirmPassword: "", phone: "", role: "user" })
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      console.error("Auth error:", err) // DEBUG
    }
    setLoading(false)
  }

  // DEBUG: Show what's in localStorage for user
  let debugUser = null
  try {
    debugUser = JSON.parse(localStorage.getItem("user"))
  } catch {
    debugUser = null
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Logo and Header */}
        <div className="auth-header">
          <div className="logo-container">
            <LuSprout className="logo-icon" />
          </div>
          <h1 className="app-title">Kheti</h1>
          <p className="app-subtitle">Growing together, harvesting success</p>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <h2 className="card-title">{isLogin ? "Welcome Back" : "Join Kheti"}</h2>
            <p className="card-description">
              {isLogin ? "Sign in to your agricultural dashboard" : "Create your account to get started"}
            </p>
          </div>

          <div className="card-content">
            {error && <div className="auth-error">{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="input-container">
                    <LuUser className="input-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="form-input"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-container">
                  <LuMail className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="form-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="input-container">
                    <LuPhone className="input-icon" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="form-input"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* --- Role Selection Dropdown --- */}
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    Register as
                  </label>
                  <div className="input-container">
                    <select
                      id="role"
                      name="role"
                      className="form-input"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="seller">Farmer</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-container">
                  <LuLock className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="form-input password-input"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <LuEyeOff className="toggle-icon" /> : <LuEye className="toggle-icon" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-container">
                    <LuLock className="input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="form-input password-input"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <LuEyeOff className="toggle-icon" /> : <LuEye className="toggle-icon" />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" className="checkbox" />
                    <label htmlFor="remember" className="checkbox-label">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="forgot-password">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (isLogin ? "Signing In..." : "Creating...") : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="separator-container">
              <hr className="separator" />
              <span className="separator-label">Or continue with</span>
            </div>

            <div className="social-buttons">
              <button className="social-button">
                {/* Google SVG */}
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="social-button">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="auth-switch">
              <span className="switch-text">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
              <button onClick={() => setIsLogin(!isLogin)} className="switch-button" type="button">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p className="footer-copyright">© 2024 Kheti. All rights reserved.</p>
          <div className="footer-links">
            <button className="footer-link">Privacy Policy</button>
            <button className="footer-link">Terms of Service</button>
            <button className="footer-link">Support</button>
          </div>
        </div>

        {/* Debug info */}
        <div style={{ background: "#f8f8f8", color: "#333", fontSize: 12, margin: 8, padding: 8 }}>
          <b>DEBUG: localStorage user</b>
          <pre>{JSON.stringify(debugUser, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
