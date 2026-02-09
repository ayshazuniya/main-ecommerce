import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import "../styles/category.css";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckIcon,
  FilterIcon,
  ArrowLeft,
  ArrowRight,
  CloseIcon
} from "../components/Icons";
import { Skeleton } from "../components/Skeleton";

const CATEGORY_MAP = {
  casual: "Casual",
  formal: "Formal",
  party: "Party",
  gym: "Gym",
  "new-arrivals": "New Arrivals",
  "top-selling": "Top Selling",
};

const COLORS = [
  { name: "green", hex: "#00C12B" },
  { name: "red", hex: "#F50606" },
  { name: "yellow", hex: "#F5DD06" },
  { name: "orange", hex: "#F57906" },
  { name: "cyan", hex: "#06CAF5" },
  { name: "blue", hex: "#063AF5" },
  { name: "purple", hex: "#7D06F5" },
  { name: "pink", hex: "#F506A4" },
  { name: "white", hex: "#FFFFFF", border: true },
  { name: "black", hex: "#000000" },
  { name: "grey", hex: "#808080" },
  { name: "navy", hex: "#000080" }, // Added some colors to match DB better
];

const SIZES = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

const STYLES = ["Casual", "Formal", "Party", "Gym"];

const ITEMS_PER_PAGE = 9;

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState([0, 500]); // Widened range
  const [selectedColor, setSelectedColor] = useState(null); // Init null
  const [selectedSize, setSelectedSize] = useState(null); // Init null
  const [selectedProductType, setSelectedProductType] = useState(null); // New state

  // Mobile Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collapsible Sections State
  const [openSections, setOpenSections] = useState({
    price: true,
    colors: true,
    size: true,
    style: true
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const categoryName = CATEGORY_MAP[name] || "Category";

  useEffect(() => {
    setLoading(true);
    fetch(`https://shopco-ecommerce-6lk1.onrender.com/products?category=${name}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else if (data.products) setProducts(data.products);
        else setProducts([]);

        // Reset filters when category changes
        setCurrentPage(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedProductType(null);
        setPriceRange([0, 500]);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => setLoading(false));
  }, [name]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = value;
    if (index === 0 && value > priceRange[1]) newRange[0] = priceRange[1];
    if (index === 1 && value < priceRange[0]) newRange[1] = priceRange[0];
    setPriceRange(newRange);
  };

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    // 1. Price Check
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

    // 2. Color Check (DB has Title Case arrays, UI has lowercase selection)
    if (selectedColor) {
      if (!product.colors || !Array.isArray(product.colors)) return false;
      // Check if any product color matches selected color (case-insensitive)
      const hasColor = product.colors.some(c => c.toLowerCase() === selectedColor.toLowerCase());
      if (!hasColor) return false;
    }

    // 3. Size Check (DB has S/M/L, UI has Full words)
    if (selectedSize) {
      if (!product.sizes || !Array.isArray(product.sizes)) return false;

      const sizeMap = {
        "XX-Small": "XXS", "X-Small": "XS",
        "Small": "S", "Medium": "M", "Large": "L",
        "X-Large": "XL", "XX-Large": "XXL", "3X-Large": "3XL"
      };
      // Try mapping, fallback to direct compare
      const targetSize = sizeMap[selectedSize] || selectedSize;

      // Direct check or mapped check
      const hasSize = product.sizes.includes(targetSize) || product.sizes.includes(selectedSize);
      if (!hasSize) return false;
    }

    // 4. Product Type (Category list) Check
    if (selectedProductType) {
      // DB field is productType (e.g. "T-shirts")
      if (selectedProductType === "Hoodie" && product.productType === "Hoodie") return true;
      // Loose matching for plural/singular if needed, but DB seems to match UI list mostly
      if (product.productType !== selectedProductType) return false;
    }

    // 5. Search Query Filter (Only for titles)
    if (searchQuery) {
      if (!product.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  // Pagination Logic (based on filtered products)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page if filtered results shrink
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, totalPages, currentPage]);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    if (totalPages <= 6) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage, '...', totalPages];
      }
    }

    return pages.map((page, idx) => (
      page === '...' ? (
        <span key={`dots-${idx}`} className="dots">...</span>
      ) : (
        <button
          key={page}
          className={`page-number ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      )
    ));
  };


  return (
    <section className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <p className="breadcrumb">
          <span className="breadcrumb-link">Home</span>
          <ChevronRight />
          <span className="breadcrumb-current">{categoryName}</span>
        </p>
      </div>

      <div className="category-layout">
        {/* LEFT FILTERS - Desktop & Mobile Drawer */}
        <aside className={`filters ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            {isMobileFilterOpen ? (
              <div className="close-icon" onClick={() => setIsMobileFilterOpen(false)}>
                <CloseIcon />
              </div>
            ) : (
              <FilterIcon />
            )}
          </div>
          <hr className="divider" />

          {/* Categories List (Product Types) */}
          <div className="filter-section">
            <ul className="category-list">
              {['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map((item) => (
                <li
                  key={item}
                  className={`category-item ${selectedProductType === item ? 'active' : ''}`}
                  onClick={() => setSelectedProductType(prev => prev === item ? null : item)}
                >
                  <span>{item}</span>
                  <ChevronRight />
                </li>
              ))}
            </ul>
          </div>
          <hr className="divider" />

          {/* Price Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleSection('price')}>
              <h4>Price</h4>
              {openSections.price ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openSections.price && (
              <>
                <div className="price-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="thumb thumb-left"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="thumb thumb-right"
                  />
                  <div className="slider-track"></div>
                  <div
                    className="slider-range"
                    style={{
                      left: `${(priceRange[0] / 500) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 500) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="price-values">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </>
            )}
          </div>
          <hr className="divider" />

          {/* Colors Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleSection('colors')}>
              <h4>Colors</h4>
              {openSections.colors ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openSections.colors && (
              <div className="colors-grid">
                {COLORS.map((color) => (
                  <div
                    key={color.name}
                    className={`color-swatch ${selectedColor === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex, border: color.border ? '1px solid #ddd' : 'none' }}
                    onClick={() => setSelectedColor(prev => prev === color.name ? null : color.name)}
                  >
                    {selectedColor === color.name && <CheckIcon color={color.name === 'white' ? 'black' : 'white'} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr className="divider" />

          {/* Size Filter */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleSection('size')}>
              <h4>Size</h4>
              {openSections.size ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openSections.size && (
              <div className="sizes-grid">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(prev => prev === size ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <hr className="divider" />

          {/* Dress Style Filter (Navigation) */}
          <div className="filter-section">
            <div className="filter-title" onClick={() => toggleSection('style')}>
              <h4>Dress Style</h4>
              {openSections.style ? <ChevronUp /> : <ChevronDown />}
            </div>
            {openSections.style && (
              <ul className="category-list">
                {STYLES.map((style) => (
                  <li
                    key={style}
                    className="category-item"
                    onClick={() => {
                      navigate(`/category/${style.toLowerCase().replace(' ', '-')}`);
                      setIsMobileFilterOpen(false); // Close drawer if open
                    }}
                  >
                    <span>{style}</span>
                    <ChevronRight />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="apply-btn" onClick={() => setIsMobileFilterOpen(false)}>Apply Filter</button>
        </aside>

        {/* Overlay for mobile */}
        {isMobileFilterOpen && <div className="filter-overlay" onClick={() => setIsMobileFilterOpen(false)}></div>}

        {/* RIGHT PRODUCTS */}
        <main className="products-area">
          <div className="products-header">
            <h2>{categoryName}</h2>
            <div className="products-meta">
              <span className="showing-text">
                Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} Products
              </span>

              {/* Mobile Filter Trigger - Only visible on mobile */}
              <div className="mobile-filter-trigger" onClick={() => setIsMobileFilterOpen(true)}>
                <div className="icon-circle">
                  <FilterIcon />
                </div>
              </div>

              <div className="sort-dropdown">
                <span className="sort-label">Sort by: <strong>Most Popular</strong></span>
                <ChevronDown />
              </div>
            </div>
          </div>

          <div className="product-grid">
            {loading ? (
              <Skeleton type="product-card" count={6} />
            ) : currentProducts.length > 0 ? (
              currentProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              // Improved Empty State
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No products match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedColor(null);
                    setSelectedSize(null);
                    setSelectedProductType(null);
                    setPriceRange([0, 500]);
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <hr className="divider" style={{ margin: '3rem 0' }} />

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
            >
              <ArrowLeft /> Previous
            </button>

            <div className="pagination-numbers">
              {renderPaginationButtons()}
            </div>

            <button
              className="pagination-btn arrow-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
            >
              Next <ArrowRight />
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}
