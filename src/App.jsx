import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";
import AuthModal from "./components/AuthModal";

function App() {
  const user = useSelector((state) => state.auth.user);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const hasPrompted = sessionStorage.getItem("hasPrompted");
    if (!user && !hasPrompted) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
        sessionStorage.setItem("hasPrompted", "true");
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <BrowserRouter>
      {showPrompt && <AuthModal onClose={() => setShowPrompt(false)} />}
      <TopBanner />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
