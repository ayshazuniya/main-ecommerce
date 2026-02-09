import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../features/cart/cartSlice";
import { TrashIcon, PlusIcon, MinusIcon, TagIcon, ArrowRight, ChevronRight } from "../components/Icons";
import AuthModal from "../components/AuthModal";
import api from "../api/api";
import "../styles/cart.css";

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, subtotal, discount, deliveryFee } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.auth.user);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount + deliveryFee;

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity >= 1) {
            dispatch(updateQuantity({ id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor, quantity: newQuantity }));
        }
    };

    const handleRemove = (item) => {
        dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor }));
    };

    const handleCheckout = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        setIsCheckingOut(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    color: item.selectedColor
                })),
                totalAmount: total
            };

            await api.post("/orders", orderData);

            alert("Order placed successfully! Check your orders in profile.");
            dispatch(clearCart());
            navigate("/");
        } catch (err) {
            console.error("CHECKOUT ERROR:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert("Checkout failed: " + errorMsg);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="cart-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight />
                <span>Cart</span>
            </div>

            <h1 className="page-title">YOUR CART</h1>

            {items.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn-primary">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-container">
                        {items.map((item, index) => (
                            <React.Fragment key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                                <div className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-header">
                                            <h3>{item.title}</h3>
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemove(item)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <p className="item-spec">
                                            Size: <span>{item.selectedSize}</span>
                                        </p>
                                        <p className="item-spec">
                                            Color: <span>{item.selectedColor}</span>
                                        </p>
                                        <div className="item-footer">
                                            <span className="item-price">${item.price}</span>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity - 1)
                                                    }
                                                >
                                                    <MinusIcon />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity + 1)
                                                    }
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index < items.length - 1 && <hr className="item-divider" />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span className="value">${subtotal}</span>
                        </div>
                        <div className="summary-row discount">
                            <span>Discount (-{discount}%)</span>
                            <span className="value">-${discountAmount.toFixed(0)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span className="value">${deliveryFee}</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span className="value">${total.toFixed(0)}</span>
                        </div>

                        <div className="promo-code">
                            <div className="promo-input">
                                <TagIcon />
                                <input type="text" placeholder="Add promo code" />
                            </div>
                            <button className="apply-btn">Apply</button>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? "Processing..." : "Go to Checkout"} <ArrowRight />
                        </button>
                    </div>
                </div>
            )}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
}
