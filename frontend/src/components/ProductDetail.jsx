import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setProduct(null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
      </div>
    );
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
        {/* Add to Cart / Buy Now buttons can go here */}
      </div>
    </div>
  );
}