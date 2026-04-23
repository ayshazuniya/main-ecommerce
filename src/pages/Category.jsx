import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "../components/Skeleton";
import API from "../api/api";
import "../styles/category.css";






// ─── Constants ───────────────────────────────────────────────
const CATEGORY_MAP = {
  casual: "Casual",
  formal: "Formal",
  party: "Party",
  gym: "Gym",
  "new-arrivals": "New Arrivals",
  "top-selling": "Top Selling",
};

const ITEMS_PER_PAGE = 9;

const COLORS = [
  { id: "green", hex: "#4CAF50" },
  { id: "red", hex: "#F44336" },
  { id: "yellow", hex: "#F4B942" },
  { id: "orange", hex: "#FF9800" },
  { id: "blue", hex: "#2196F3" },
  { id: "navy", hex: "#3F51B5" },
  { id: "purple", hex: "#9C27B0" },
  { id: "pink", hex: "#E91E63" },
  { id: "white", hex: "#F5F5F5" },
  { id: "black", hex: "#212121" },
];

const SIZES = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

// ─── Category Page ────────────────────────────────────────────
export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();

  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [priceMin, setPriceMin] = useState(500);
  const [priceMax, setPriceMax] = useState(2000);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryName = CATEGORY_MAP[name] || "All Products";

  // ✅ Fetch with category and price filters
  useEffect(() => {
    setLoading(true);

    const params = {
      category: name && name !== "all" ? categoryName : undefined,
      min_price: priceMin,
      max_price: priceMax
    };

    API.get("/products/", { params })
      .then((res) => {
        setProducts(res.data);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, [name, priceMin, priceMax]);


  // ✅ Pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...", totalPages - 1, totalPages);
    }
    return pages;
  };

  // ─── Sidebar JSX ─────────────────────────────────────────────
  const FilterSidebar = (
    <>
      <div className="filters-header">
        <h3>Filters</h3>
        <span
          className="close-icon"
          onClick={() => setMobileOpen(false)}
          aria-label="Close filters"
        >
          ✕
        </span>
      </div>

      <hr className="divider" />

      {/* Categories */}
      <ul className="category-list">
        {Object.entries(CATEGORY_MAP).map(([key, label]) => (
          <li
            key={key}
            className={`category-item ${name === key ? "active" : ""}`}
            onClick={() => { navigate(`/category/${key}`); setMobileOpen(false); }}
          >
            {label}
            <span>›</span>
          </li>
        ))}
      </ul>

      <hr className="divider" />

      {/* Price */}
      <div className="filter-section">
        <div className="filter-title">
          <h4>Price</h4>
          <span>∧</span>
        </div>
        <div className="price-slider-container">
          <div className="slider-track" />
          <div
            className="slider-range"
            style={{
              left: `${((priceMin - 0) / 5000) * 100}%`,
              right: `${100 - ((priceMax - 0) / 5000) * 100}%`,
            }}
          />
          <input
            type="range" min={0} max={5000} value={priceMin}
            className="thumb"
            onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 10))}
          />
          <input
            type="range" min={0} max={5000} value={priceMax}
            className="thumb"
            onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 10))}
          />
        </div>
        <div className="price-values">
          <span>₹{priceMin}</span>
          <span>₹{priceMax}</span>
        </div>
      </div>

      <hr className="divider" />

      {/* Colors */}
      <div className="filter-section">
        <div className="filter-title">
          <h4>Colors</h4>
          <span>∧</span>
        </div>
        <div className="colors-grid">
          {COLORS.map((c) => (
            <div
              key={c.id}
              className="color-swatch"
              style={{ backgroundColor: c.hex }}
              onClick={() => setSelectedColor(selectedColor === c.id ? null : c.id)}
            >
              {selectedColor === c.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Sizes */}
      <div className="filter-section">
        <div className="filter-title">
          <h4>Size</h4>
          <span>∧</span>
        </div>
        <div className="sizes-grid">
          {SIZES.map((size) => (
            <button
              key={size}
              className={`size-btn ${selectedSize === size ? "active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Dress Style */}
      <div className="filter-section">
        <div className="filter-title">
          <h4>Dress Style</h4>
          <span>∧</span>
        </div>
        <ul className="category-list">
          {DRESS_STYLES.map((style) => (
            <li key={style} className="category-item">
              {style} <span>›</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="apply-btn" onClick={() => setMobileOpen(false)}>
        Apply Filter
      </button>
    </>
  );

  // ─── Render ───────────────────────────────────────────────────
  return (
    <section className="category-page">

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span>›</span>
          <span className="breadcrumb-current">{categoryName}</span>
        </nav>
      </div>

      <div className="category-layout">

        {/* Desktop Sidebar */}
        <aside className={`filters ${mobileOpen ? "mobile-open" : ""}`}>
          {FilterSidebar}
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="filter-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Products Area */}
        <div className="products-area">

          <div className="products-header">
            <h2>{categoryName}</h2>
            <div className="products-meta">
              <span className="showing-text">
                Showing {products.length > 0 ? startIndex + 1 : 0}–
                {Math.min(startIndex + ITEMS_PER_PAGE, products.length)} of{" "}
                {products.length} Products
              </span>

              <div
                className="mobile-filter-trigger"
                onClick={() => setMobileOpen(true)}
                title="Open Filters"
              >
                ⚙
              </div>

              <div className="sort-dropdown">
                Sort by: <strong>Most Popular</strong> ▾
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {loading ? (
              <Skeleton type="product-card" count={6} />
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
                No products found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn arrow-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-numbers">
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="dots">…</span>
                  ) : (
                    <button
                      key={p}
                      className={`page-number ${currentPage === p ? "active" : ""}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                className="pagination-btn arrow-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}