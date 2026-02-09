import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "../features/products/productSlice";
import { logout } from "../features/auth/authSlice";
import { SearchIcon, CartIcon, UserIcon, MenuIcon, ChevronDown } from "./Icons";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isCategoryPage = location.pathname.startsWith("/category/");
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const user = useSelector((state) => state.auth.user);

  const cartItemsCount = useSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Clear search query when navigating away from category pages
  useEffect(() => {
    if (!isCategoryPage) {
      dispatch(setSearchQuery(""));
    }
  }, [location.pathname, isCategoryPage, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">

        {/* LEFT */}
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </button>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 className="logo">SHOP.CO</h2>
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="nav-links">
          <Link to="/category/casual" className="shop-link">
            Shop <ChevronDown />
          </Link>
          <Link to="/category/top-selling">On Sale</Link>
          <Link to="/category/new-arrivals">New Arrivals</Link>
          <Link to="/">Brands</Link>
        </nav>

        {/* RIGHT */}
        <div className="nav-right">
          {isCategoryPage && (
            <div className="search-bar">
              <SearchIcon />
              <input
                placeholder="Search products in this category..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}
          {user && (
            <Link to="/cart" className="nav-icon-link">
              <CartIcon />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="profile-container">
              <div
                className="nav-profile-link"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="profile-img" />
                ) : (
                  <div className="profile-initials">{user.name.charAt(0)}</div>
                )}
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  <p className="menu-name">{user.name}</p>
                  <p className="menu-email">{user.email}</p>
                  <hr />
                  <Link to="/orders" onClick={() => setShowProfileMenu(false)}>My Orders</Link>
                  <span onClick={handleLogout} className="logout-btn">Logout</span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="nav-icon-link">
              <UserIcon />
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          {isCategoryPage && (
            <div className="mobile-search">
              <SearchIcon />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}
          <Link to="/category/casual" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/category/top-selling" onClick={() => setOpen(false)}>On Sale</Link>
          <Link to="/category/new-arrivals" onClick={() => setOpen(false)}>New Arrivals</Link>
          <Link to="/" onClick={() => setOpen(false)}>Brands</Link>
          {!user && <Link to="/auth" onClick={() => setOpen(false)}>Login / Sign Up</Link>}
        </div>
      )}
    </header>
  );
}
