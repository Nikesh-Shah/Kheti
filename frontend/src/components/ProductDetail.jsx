import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItemToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItemToCart(product._id, quantity);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-gallery">
        <div className="main-image">
          <img
            src={
              Array.isArray(product.image) && product.image.length > 0
                ? (product.image[selectedImage].startsWith("http")
                    ? product.image[selectedImage]
                    : `/${product.image[selectedImage].replace(/\\/g, "/")}`)
                : "/placeholder.svg?height=300&width=300"
            }
            alt={product.title}
            style={{ maxWidth: 350, maxHeight: 350, borderRadius: 8 }}
          />
        </div>
        <div className="thumbnail-row" style={{ marginTop: 12, display: "flex" }}>
          {Array.isArray(product.image) && product.image.length > 0 &&
            product.image.map((img, idx) => (
              <img
                key={idx}
                src={img.startsWith("http") ? img : `/${img.replace(/\\/g, "/")}`}
                alt={`Thumbnail ${idx + 1}`}
                className={selectedImage === idx ? "active" : ""}
                onClick={() => setSelectedImage(idx)}
                style={{
                  width: 60,
                  height: 60,
                  marginRight: 8,
                  borderRadius: 6,
                  border: selectedImage === idx ? "2px solid #008000" : "1px solid #ccc",
                  cursor: "pointer",
                  objectFit: "cover"
                }}
              />
            ))}
        </div>
      </div>
      <div className="product-detail-info">
        <h2>{product.title}</h2>
        <p className="product-detail-desc">{product.description}</p>
        <div className="product-detail-meta">
          <div><strong>Price:</strong> ₹{product.price}</div>
          <div><strong>Quantity:</strong> {product.quantity} {product.unit}</div>
          <div><strong>Category:</strong> {product.category}</div>
        </div>
        <div className="add-to-cart">
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}