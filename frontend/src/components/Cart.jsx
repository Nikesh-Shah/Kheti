"use client"

import { useState, useEffect } from "react"
import { getCartItems, updateCartItem, removeFromCart } from "../api/api"
import "../Styles/Cart.css"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    fetchCartItems()
  }, [])

  async function fetchCartItems() {
    setLoading(true)
    setError("")
    try {
      const res = await getCartItems()
      setCartItems(res.data || [])
    } catch (err) {
      setError("Failed to fetch cart items.")
    }
    setLoading(false)
  }

  async function handleUpdateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return

    setUpdating((prev) => ({ ...prev, [productId]: true }))
    setError("")
    try {
      await updateCartItem(productId, { quantity: newQuantity })
      setCartItems((prev) =>
        prev.map((item) => (item.product._id === productId ? { ...item, quantity: newQuantity } : item)),
      )
      setSuccess("Cart updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to update cart item.")
    }
    setUpdating((prev) => ({ ...prev, [productId]: false }))
  }

  async function handleRemoveItem(productId) {
    if (!window.confirm("Are you sure you want to remove this item from cart?")) return

    setError("")
    try {
      await removeFromCart(productId)
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId))
      setSuccess("Item removed from cart!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to remove item from cart.")
    }
  }

  function calculateTotal() {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  function handleProceedToPayment() {
    if (cartItems.length === 0) {
      setError("Your cart is empty!")
      return
    }
    setShowPayment(true)
  }

  function handlePaymentSelect(method) {
    setSelectedPayment(method)
  }

  function handleBuyNow() {
    if (!selectedPayment) {
      setError("Please select a payment method.")
      return
    }

    // Simulate payment processing
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowPayment(false)
      setShowSuccess(true)
      setCartItems([]) // Clear cart after successful payment
    }, 2000)
  }

  function closeSuccessModal() {
    setShowSuccess(false)
    setSelectedPayment("")
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="cart-container-cart">
        <div className="cart-loading-cart">
          <div className="cart-spinner-cart"></div>
          <h3>Loading Cart...</h3>
          <p>Please wait while we fetch your items</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container-cart">
      <div className="cart-header-cart">
        <h2 className="cart-title-cart">
          <svg className="cart-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h7a2 2 0 002-2v-6M9 19v2m6-2v2" />
          </svg>
          Shopping Cart
        </h2>
        <p className="cart-subtitle-cart">Review your items before checkout</p>
      </div>

      {error && (
        <div className="cart-error-cart">
          <svg className="cart-error-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError("")} className="cart-dismiss-cart">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="cart-success-cart">
          <svg className="cart-success-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="cart-dismiss-cart">
            ×
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty-cart">
          <svg className="cart-empty-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started with your order</p>
          <button className="cart-shop-btn-cart" onClick={() => window.history.back()}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-cart">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item-cart">
                <div className="cart-item-image-cart">
                  {Array.isArray(item.product.image) && item.product.image.length > 0 ? (
                    <img
                      src={
                        item.product.image[0].startsWith("http")
                          ? item.product.image[0]
                          : `/${item.product.image[0].replace(/\\/g, "/")}`
                      }
                      alt={item.product.title}
                    />
                  ) : (
                    <div className="cart-no-image-cart">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="cart-item-details-cart">
                  <h3 className="cart-item-title-cart">{item.product.title}</h3>
                  <p className="cart-item-category-cart">{item.product.category}</p>
                  <div className="cart-item-farmer-cart">
                    <svg className="cart-farmer-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>By {item.product.farmer?.firstName || "Unknown Farmer"}</span>
                  </div>
                  <div className="cart-item-price-cart">
                    ₹{item.product.price} per {item.product.unit}
                  </div>
                </div>

                <div className="cart-item-actions-cart">
                  <div className="cart-quantity-controls-cart">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating[item.product._id]}
                      className="cart-qty-btn-cart"
                    >
                      -
                    </button>
                    <span className="cart-quantity-cart">
                      {updating[item.product._id] ? <div className="cart-mini-spinner-cart"></div> : item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      disabled={updating[item.product._id]}
                      className="cart-qty-btn-cart"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total-cart">₹{(item.product.price * item.quantity).toFixed(2)}</div>

                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="cart-remove-btn-cart"
                    title="Remove from cart"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-cart">
            <div className="cart-total-section-cart">
              <div className="cart-total-row-cart">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="cart-total-row-cart">
                <span>Delivery Fee</span>
                <span>₹50.00</span>
              </div>
              <div className="cart-total-row-cart cart-total-final-cart">
                <span>Total Amount</span>
                <span>₹{(calculateTotal() + 50).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="cart-checkout-btn-cart"
              disabled={cartItems.length === 0}
            >
              <svg className="cart-checkout-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l-4-4v4" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Proceed to Payment
            </button>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="cart-modal-overlay-cart">
          <div className="cart-payment-modal-cart">
            <div className="cart-payment-header-cart">
              <h3>Choose Payment Method</h3>
              <button onClick={() => setShowPayment(false)} className="cart-close-btn-cart">
                ×
              </button>
            </div>

            <div className="cart-payment-summary-cart">
              <h4>Order Summary</h4>
              <div className="cart-summary-details-cart">
                <div className="cart-summary-row-cart">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="cart-summary-row-cart">
                  <span>Delivery Fee</span>
                  <span>₹50.00</span>
                </div>
                <div className="cart-summary-row-cart cart-summary-total-cart">
                  <span>Total</span>
                  <span>₹{(calculateTotal() + 50).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="cart-payment-methods-cart">
              <h4>Select Payment Method</h4>

              <div className="cart-payment-options-cart">
                <label className={`cart-payment-option-cart ${selectedPayment === "khalti" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="khalti" onChange={() => handlePaymentSelect("khalti")} />
                  <div className="cart-payment-content-cart">
                    <div className="cart-payment-logo-cart khalti">
                      <span>Khalti</span>
                    </div>
                    <div className="cart-payment-info-cart">
                      <h5>Khalti Digital Wallet</h5>
                      <p>Pay securely with your Khalti account</p>
                    </div>
                  </div>
                </label>

                <label className={`cart-payment-option-cart ${selectedPayment === "esewa" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="esewa" onChange={() => handlePaymentSelect("esewa")} />
                  <div className="cart-payment-content-cart">
                    <div className="cart-payment-logo-cart esewa">
                      <span>eSewa</span>
                    </div>
                    <div className="cart-payment-info-cart">
                      <h5>eSewa Digital Payment</h5>
                      <p>Quick and secure payment with eSewa</p>
                    </div>
                  </div>
                </label>

                <label className={`cart-payment-option-cart ${selectedPayment === "cod" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="cod" onChange={() => handlePaymentSelect("cod")} />
                  <div className="cart-payment-content-cart">
                    <div className="cart-payment-logo-cart cod">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                    </div>
                    <div className="cart-payment-info-cart">
                      <h5>Cash on Delivery</h5>
                      <p>Pay when your order is delivered</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="cart-payment-actions-cart">
              <button onClick={() => setShowPayment(false)} className="cart-cancel-btn-cart">
                Cancel
              </button>
              <button onClick={handleBuyNow} className="cart-buy-btn-cart" disabled={!selectedPayment || loading}>
                {loading ? (
                  <>
                    <div className="cart-btn-spinner-cart"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="cart-buy-icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Buy Now - ₹{(calculateTotal() + 50).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="cart-modal-overlay-cart">
          <div className="cart-success-modal-cart">
            <div className="cart-success-animation-cart">
              <svg className="cart-success-check-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
            <div className="cart-success-details-cart">
              <div className="cart-success-amount-cart">Total Paid: ₹{(calculateTotal() + 50).toFixed(2)}</div>
              <div className="cart-success-method-cart">
                Payment Method: {selectedPayment === "cod" ? "Cash on Delivery" : selectedPayment.toUpperCase()}
              </div>
            </div>
            <button onClick={closeSuccessModal} className="cart-success-btn-cart">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
