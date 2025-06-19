import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// --- Auth APIs ---
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getAllUsers = () => api.get('/auth/users');
export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

// --- Product APIs ---
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (category) => api.get(`/products/category/${category}`);
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getFarmerProducts = () => api.get('/products/farmer');

// --- Order APIs ---
export const placeOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my');
export const getAllOrders = () => api.get('/orders/admin');
export const getFarmerOrders = () => api.get('/orders/farmer');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// --- Category APIs ---
export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const getTopSellingByCategory = () => api.get('/categories/top-selling-by-category');

// --- Cart APIs ---
export const getCartItems = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (productId, quantity) => api.put('/cart', { productId, quantity });
export const removeFromCart = (productId) => api.delete('/cart/item', { data: { productId } });
export const clearCart = () => api.delete('/cart');



export default api;