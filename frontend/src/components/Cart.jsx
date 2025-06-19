"use client"

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/api";
import "../Styles/Cart.css";

export default function Cart() {
  const {
    cartItems,
    cartTotal,
    loading,
    error,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Calculate total with delivery fee
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const totalWithDelivery = cartTotal + deliveryFee;

  // Handle payment process
  const handleBuyNow = async () => {
    if (!selectedPayment) return;
    setPaymentLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Place order after payment (match your Order model)
        await placeOrder({
          products: cartItems.map((item) => ({
            product: item.product?._id || item.product,
            quantity: item.quantity,
          })),
          totalAmount: totalWithDelivery,
          // status: 'pending', // optional, backend defaults to 'pending'
          // paymentMethod: selectedPayment, // only if you add this field to your model
        });
        clearCart();
        setShowPayment(false);
        setShowSuccess(true);
      } catch (err) {
        alert("Order failed. Please try again.");
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  // Empty cart UI
  if (!loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="cart-empty-beautiful">
        <img
          src="/empty-cart.svg"
          alt="Empty Cart"
          className="cart-empty-img"
        />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button
          className="cart-shop-btn-cart"
          onClick={() => (window.location.href = "/product")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container-cart">
      <h1 className="cart-title-cart">Your Cart</h1>
      {error && <div className="cart-error-cart">{error}</div>}
      {loading ? (
        <div className="cart-loading-cart">
          <div className="cart-spinner-cart"></div>
          Loading...
        </div>
      ) : (
        <>
          <div className="cart-items-list-cart">
            {cartItems.map((item) => (
              <div className="cart-item-cart" key={item.product?._id || item.product}>
                <img
                  src={
                    item.product?.image?.[0]
                      ? item.product.image[0]
                      : "/empty-cart.svg"
                  }
                  alt={item.product?.title || "Product"}
                  className="cart-item-img-cart"
                />
                <div className="cart-item-info-cart">
                  <h3>{item.product?.title || "Product"}</h3>
                  <p>Price: ₹{item.product?.price}</p>
                  <div className="cart-qty-row-cart">
                    <button
                      className="cart-qty-btn-cart"
                      onClick={() =>
                        updateItemQuantity(
                          item.product?._id || item.product,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-qty-cart">{item.quantity}</span>
                    <button
                      className="cart-qty-btn-cart"
                      onClick={() =>
                        updateItemQuantity(
                          item.product?._id || item.product,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-remove-btn-cart"
                    onClick={() =>
                      removeItem(item.product?._id || item.product)
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-total-cart">
                  ₹{(item.product?.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary-cart">
            <div className="cart-summary-row-cart">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row-cart">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="cart-summary-total-cart">
              <span>Total</span>
              <span>₹{totalWithDelivery.toFixed(2)}</span>
            </div>
            <button
              className="cart-buy-btn-cart"
              onClick={() => setShowPayment(true)}
              disabled={cartItems.length === 0}
            >
              Buy Now
            </button>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="cart-modal-overlay-cart">
          <div className="cart-modal-cart">
            <h2>Payment</h2>
            <div className="cart-payment-methods-cart">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPayment === "card"}
                  onChange={() => setSelectedPayment("card")}
                  disabled={paymentLoading}
                />
                Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={selectedPayment === "upi"}
                  onChange={() => setSelectedPayment("upi")}
                  disabled={paymentLoading}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPayment === "cod"}
                  onChange={() => setSelectedPayment("cod")}
                  disabled={paymentLoading}
                />
                Cash on Delivery
              </label>
            </div>
            <button
              onClick={handleBuyNow}
              className="cart-buy-btn-cart"
              disabled={!selectedPayment || paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <div className="cart-btn-spinner-cart"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay ₹{totalWithDelivery.toFixed(2)}
                </>
              )}
            </button>
            <button
              className="cart-cancel-btn-cart"
              onClick={() => setShowPayment(false)}
              disabled={paymentLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="cart-modal-overlay-cart">
          <div className="cart-modal-cart">
            <div className="cart-success-checkmark-cart">&#10003;</div>
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
            <button
              className="cart-shop-btn-cart"
              onClick={() => setShowSuccess(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
