import { Link } from "react-router-dom";
import "../styles/product.css";
import { StarFull, StarHalf } from "../components/Icons";

// ⭐ Helper: render stars safely
const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarFull key={`full-${i}`} className="star-icon" />);
  }
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className="star-icon" />);
  }
  return stars;
};

export default function ProductCard({ product }) {
  if (!product) return null;

  const rating = product.rating || 4.5;
  const maxRating = 5;
  const image = product.image || "https://via.placeholder.com/295x298";
  const name = product.name || "No Name";
  const price = product.price || 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      {/* IMAGE */}
      <div className="image-container">
        <img
          src={image}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/295x298";
          }}
        />
      </div>

      {/* TITLE */}
      <h4 className="product-title">{name}</h4>

      {/* RATING */}
      <div className="product-rating">
        <div className="stars">{renderStars(rating)}</div>
        <span className="rating-score">{rating}/{maxRating}</span>
      </div>

      {/* PRICE */}
      <div className="product-price">
        <span className="current-price">₹{price}</span>
        {product.old_price && (
          <>
            <span className="old-price">₹{product.old_price}</span>
            <span className="discount-badge">
              -{Math.round(((product.old_price - price) / product.old_price) * 100)}%
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
