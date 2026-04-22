import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "../features/products/productSlice";
import { logoutUser } from "../features/auth/authSlice";
import { SearchIcon, CartIcon, UserIcon, MenuIcon, LogOutIcon } from "./Icons";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchQuery = useSelector((state) => state.products.searchQuery);
  const user = useSelector((state) => state.auth.user);

  const cartItemsCount = useSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowProfileMenu(false);
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-container">

        {/* LEFT */}
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </button>

          <Link to="/" className="logo">
            SHOP.CO
          </Link>

          <nav className="nav-links">
            <Link to="/category/casual">Shop</Link>
            <Link to="/category/top-selling">On Sale</Link>
            <Link to="/category/new-arrivals">New Arrivals</Link>
            <Link to="/">Brands</Link>
          </nav>
        </div>

        {/* SEARCH (ALWAYS VISIBLE) */}
        {/* SEARCH */}
<div className="search-bar">
  <SearchIcon />
  <input
    type="text"
    placeholder="Search for products..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
</div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* CART (ALWAYS SHOW) */}
          <Link to="/cart" className="nav-icon-link">
            <CartIcon />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* USER */}
          {user ? (
            <div className="profile-container">
              <div
                className="nav-profile-link"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="user" className="profile-img" />
                ) : (
                  <div className="profile-initials">
                    {user.name?.charAt(0)}
                  </div>
                )}
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <hr />
                  <Link to="/orders">My Orders</Link>
                  <span onClick={handleLogout} className="logout-link">
                    <LogOutIcon /> Logout
                  </span>

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
          <Link to="/category/casual">Shop</Link>
          <Link to="/category/top-selling">On Sale</Link>
          <Link to="/category/new-arrivals">New Arrivals</Link>
          <Link to="/">Brands</Link>
        </div>
      )}
    </header>
  );
}