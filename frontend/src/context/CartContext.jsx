// src/contexts/CartContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getCartItems, addToCart, updateCartItem, removeFromCart, clearCart as apiClearCart } from '../api/api';

// Create the context
const CartContext = createContext();

// Create a provider component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Add success state

  // Calculate cart count and total
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
  const cartTotal = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => {
        // Handle both potential structures: {price, quantity} or {product: {price}, quantity}
        const price = item.product ? item.product.price : item.price;
        return sum + (price * item.quantity);
      }, 0)
    : 0;

  // Fetch cart items on mount
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchCartItems();
    }
  }, []);

  // Function to fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCartItems();
      // Ensure res.data is an array
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error(err);
      setCartItems([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addItemToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      await addToCart({ productId, quantity });
      setSuccess('Item added to cart!');
      await fetchCartItems(); // Refetch to get updated cart
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      // This now matches your backend route structure
      await updateCartItem(productId, quantity);
      setSuccess('Cart updated!');
      await fetchCartItems();
    } catch (err) {
      setError('Failed to update item quantity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      // This now matches your backend route structure
      await removeFromCart(productId);
      setSuccess('Item removed from cart!');
      await fetchCartItems();
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear cart (ADD THIS FUNCTION)
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClearCart();
      setCartItems([]);
      setSuccess('Cart cleared!');
    } catch (err) {
      setError('Failed to clear cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        cartTotal, 
        loading, 
        error,
        success,
        setError,
        setSuccess,
        addItemToCart, 
        updateItemQuantity, 
        removeItem,
        clearCart,
        fetchCartItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);