import React, { useState } from "react"
import { loginUser, registerUser } from "../api/api"
import { LuSprout, LuMail, LuLock, LuUser, LuPhone, LuEye, LuEyeOff } from "react-icons/lu"
import "../Styles/Auth.css"
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
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
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    if (e.target.name === 'remember') {
      setRememberMe(value)
    } else {
      setForm({ ...form, [e.target.name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password })
        
        if (rememberMe) {
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("user", JSON.stringify(res.data.user))
        } else {
          sessionStorage.setItem("token", res.data.token)
          sessionStorage.setItem("user", JSON.stringify(res.data.user))
        }

        const role = res.data.user?.role
        if (role === "admin") {
          navigate("/admin/dashboard")
        } else if (role === "seller" || role === "farmer") {
          navigate("/farmer/dashboard")
        } else {
          navigate("/")
        }
      } else {
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
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user))
        }
        alert("Registration successful! Please login.")
        setIsLogin(true)
        setForm({ name: "", email: "", password: "", confirmPassword: "", phone: "", role: "user" })
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
    setLoading(false)
  }

  const isLoggedIn = () => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/auth')
  }

  return (
    <div className="auth-container-auth">
      <div className="auth-wrapper-auth">
        <div className="auth-header-auth">
          <div className="logo-container-auth">
            <LuSprout className="logo-icon-auth" />
          </div>
          <h1 className="app-title-auth">Kheti</h1>
          <p className="app-subtitle-auth">Growing together, harvesting success</p>
        </div>

        <div className="auth-card-auth">
          <div className="card-header-auth">
            <h2 className="card-title-auth">{isLogin ? "Welcome Back" : "Join Kheti"}</h2>
            <p className="card-description-auth">
              {isLogin ? "Sign in to your agricultural dashboard" : "Create your account to get started"}
            </p>
          </div>

          <div className="card-content-auth">
            {error && <div className="auth-error-auth">{error}</div>}
            <form className="auth-form-auth" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group-auth">
                  <label htmlFor="name" className="form-label-auth">Full Name</label>
                  <div className="input-container-auth">
                    <LuUser className="input-icon-auth" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="form-input-auth"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group-auth">
                <label htmlFor="email" className="form-label-auth">Email Address</label>
                <div className="input-container-auth">
                  <LuMail className="input-icon-auth" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="form-input-auth"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="form-group-auth">
                  <label htmlFor="phone" className="form-label-auth">Phone Number</label>
                  <div className="input-container-auth">
                    <LuPhone className="input-icon-auth" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="form-input-auth"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="form-group-auth">
                  <label htmlFor="role" className="form-label-auth">Register as</label>
                  <div className="input-container-auth">
                    <select
                      id="role"
                      name="role"
                      className="form-input-auth"
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

              <div className="form-group-auth">
                <label htmlFor="password" className="form-label-auth">Password</label>
                <div className="input-container-auth">
                  <LuLock className="input-icon-auth" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="form-input-auth password-input-auth"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-auth"
                    tabIndex={-1}
                  >
                    {showPassword ? <LuEyeOff className="toggle-icon-auth" /> : <LuEye className="toggle-icon-auth" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group-auth">
                  <label htmlFor="confirmPassword" className="form-label-auth">Confirm Password</label>
                  <div className="input-container-auth">
                    <LuLock className="input-icon-auth" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="form-input-auth password-input-auth"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle-auth"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <LuEyeOff className="toggle-icon-auth" />
                      ) : (
                        <LuEye className="toggle-icon-auth" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="form-options-auth">
                  <div className="remember-me-auth">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      name="remember"
                      className="checkbox-auth" 
                      checked={rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="remember" className="checkbox-label-auth">Remember me</label>
                  </div>
                  <button type="button" className="forgot-password-auth">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="submit-button-auth" disabled={loading}>
                {loading ? (isLogin ? "Signing In..." : "Creating...") : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="separator-container-auth">
              <hr className="separator-auth" />
              <span className="separator-label-auth">Or continue with</span>
            </div>

            <div className="social-buttons-auth">
              <button className="social-button-auth">
                <svg className="social-icon-auth" viewBox="0 0 24 24">
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
              <button className="social-button-auth">
                <svg className="social-icon-auth" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="auth-switch-auth">
              <span className="switch-text-auth">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
              <button onClick={() => setIsLogin(!isLogin)} className="switch-button-auth" type="button">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>

        <div className="auth-footer-auth">
          <p className="footer-copyright">© 2024 Kheti. All rights reserved.</p>
          <div className="footer-links-auth">
            <button className="footer-links-auth">Privacy Policy</button>
            <button className="footer-links-auth">Terms of Service</button>
            <button className="footer-links-auth">Support</button>
          </div>
        </div>
      </div>
    </div>
  )
}
