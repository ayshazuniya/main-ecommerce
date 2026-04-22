import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import "../styles/product-detail.css";
import API from "../api/api";

const REVIEWS = [
  { id: 1, name: "Samantha D.", rating: 4, text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt!", date: "August 14, 2023" },
  { id: 2, name: "Alex M.", rating: 4, text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.", date: "August 15, 2023" },
  { id: 3, name: "Ethan R.", rating: 3, text: "This t-shirt is a must-have for anyone who appreciates good design. The intricate yet stylish pattern caught my eye, and the fit is perfect. I can see this designer's touch in every aspect of this shirt.", date: "August 16, 2023" },
  { id: 4, name: "Olivia P.", rating: 4, text: "As a UI enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.", date: "August 17, 2023" },
  { id: 5, name: "Liam K.", rating: 4, text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.", date: "August 18, 2023" },
  { id: 6, name: "Ava H.", rating: 4, text: "I'm not just wearing a t-shirt, I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.", date: "August 19, 2023" },
];

const COLOR_OPTIONS = [
  { hex: "#4F4631", filter: "none" },
  { hex: "#314F4A", filter: "hue-rotate(160deg) saturate(0.8)" },
  { hex: "#31344F", filter: "hue-rotate(200deg) saturate(0.6) brightness(0.85)" },
];

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#FFC633" : "#ddd", fontSize: "18px" }}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const [visibleReviews, setVisibleReviews] = useState(6);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setActiveImg(res.data.image);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    // Fetch related products
   API.get(`/products/?category=you-might-also-like`)
  .then(res => {
    const filtered = res.data.filter(p => String(p.id) !== String(id));
    setRelatedProducts(filtered.slice(0, 4));
  })
  .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize,
      selectedColor: selectedColor.hex,
      quantity,
    }));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  if (loading) return <div className="pd-page">Loading...</div>;
  if (!product) return <div className="pd-page">Product not found</div>;

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null;

  return (
    <div className="pd-page">

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> &rsaquo;
        <Link to="/category/all"> Shop</Link> &rsaquo;
        <Link to="/category/men"> Men</Link> &rsaquo;
        <span> T-shirts</span>
      </div>

      <div className="pd-top">
        {/* IMAGES */}
        <div className="pd-images">
          <div className="pd-thumbs">
            {COLOR_OPTIONS.map((c, i) => (
              <img
                key={i}
                src={product.image}
                alt=""
                className={selectedColor.hex === c.hex ? "active" : ""}
                style={{ filter: c.filter }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
          <div className="pd-main">
            <img
              src={activeImg || product.image}
              alt={product.name}
              style={{ filter: selectedColor.filter, transition: "filter 0.3s ease" }}
            />
          </div>
        </div>

        {/* INFO */}
        <div className="pd-info">
          <h1>{product.name}</h1>

          <div className="pd-rating">
            <Stars rating={Math.round(product.rating || 4)} />
            <span className="rating-text">{product.rating || "4.5"}/5</span>
          </div>

          <div className="pd-price">
            <strong>₹{product.price}</strong>
            {product.old_price && (
              <>
                <span className="old">₹{product.old_price}</span>
                <span className="off">-{discount}%</span>
              </>
            )}
          </div>

          <p className="pd-desc">{product.description}</p>
          <hr className="pd-divider" />

          <div className="pd-colors">
            <p className="pd-label">Select Colors</p>
            <div className="color-dots">
              {COLOR_OPTIONS.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => setSelectedColor(c)}
                  className={`color-dot ${selectedColor.hex === c.hex ? "active" : ""}`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor.hex === c.hex && (
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <hr className="pd-divider" />

          <div className="pd-sizes">
            <p className="pd-label">Choose Size</p>
            <div className="size-btns">
              {["Small", "Medium", "Large", "X-Large"].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={selectedSize === size ? "active" : ""}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <hr className="pd-divider" />

          <div className="pd-cart">
            <div className="qty-box">
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="add-cart" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="pd-tabs">
        {["details", "reviews", "faqs"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" && "Product Details"}
            {tab === "reviews" && "Rating & Reviews"}
            {tab === "faqs" && "FAQs"}
          </button>
        ))}
      </div>

      {activeTab === "reviews" && (
        <div className="pd-reviews">
          <div className="reviews-header">
            <h2>All Reviews <span>({REVIEWS.length})</span></h2>
            <div className="reviews-actions">
              <button className="filter-btn">⚙</button>
              <select className="sort-select">
                <option>Latest</option>
                <option>Oldest</option>
              </select>
              <button className="write-review-btn">Write a Review</button>
            </div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.slice(0, visibleReviews).map(r => (
              <div key={r.id} className="review-card">
                <div className="review-top">
                  <Stars rating={r.rating} />
                  <span className="review-dots">•••</span>
                </div>
                <div className="review-name">
                  {r.name}
                  <span className="verified">✓</span>
                </div>
                <p className="review-text">"{r.text}"</p>
                <small>Posted on {r.date}</small>
              </div>
            ))}
          </div>
          {visibleReviews < REVIEWS.length && (
            <button className="load-more" onClick={() => setVisibleReviews(v => v + 6)}>
              Load More Reviews
            </button>
          )}
        </div>
      )}

      {activeTab === "details" && (
        <div className="pd-tab-content"><p>{product.description}</p></div>
      )}

      {activeTab === "faqs" && (
        <div className="pd-tab-content"><p>Frequently asked questions will appear here.</p></div>
      )}

      {/* YOU MIGHT ALSO LIKE */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">YOU MIGHT ALSO LIKE</h2>
          <div className="related-grid">
            {relatedProducts.map(p => {
              const relDiscount = p.old_price
                ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
                : null;
              return (
                <div
                  key={p.id}
                  className="rel-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="rel-img-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <h4>{p.name}</h4>
                  <div className="rel-rating">
                    <Stars rating={Math.round(p.rating || 4)} />
                    <span className="rel-rating-text">{p.rating || "4.0"}/5</span>
                  </div>
                  <div className="rel-price">
                    <strong>₹{p.price}</strong>
                    {p.old_price && (
                      <>
                        <span className="old"> ₹{p.old_price}</span>
                        <span className="off"> -{relDiscount}%</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showMessage && <div className="toast">Added to cart ✅</div>}
    </div>
  );
}