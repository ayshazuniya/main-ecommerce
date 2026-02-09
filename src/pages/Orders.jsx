import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight } from "../components/Icons";
import api from "../api/api";
import "../styles/orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                setOrders(res.data);
            } catch (err) {
                console.error("Fetch orders failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="orders-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight />
                <span>My Orders</span>
            </div>

            <h1 className="page-title">MY ORDERS</h1>

            {loading ? (
                <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <p className="order-label">Order ID</p>
                                    <p className="order-value">#{order.id}</p>
                                </div>
                                <div>
                                    <p className="order-label">Date</p>
                                    <p className="order-value">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="order-label">Status</p>
                                    <p className="order-status" data-status={order.status}>{order.status}</p>
                                </div>
                                <div>
                                    <p className="order-label">Total Amount</p>
                                    <p className="order-value">${order.totalAmount}</p>
                                </div>
                            </div>

                            <div className="order-items">
                                {(order.Products || order.products || []).map((product) => (
                                    <div key={product.id} className="order-item">
                                        <img src={product.images ? product.images[0] : ''} alt={product.title} className="order-item-img" />
                                        <div className="order-item-info">
                                            <h3>{product.title}</h3>
                                            <p>Size: {product.OrderItem?.size || product.order_item?.size || 'N/A'}, Color: {product.OrderItem?.color || product.order_item?.color || 'N/A'}</p>
                                            <p>Qty: {product.OrderItem?.quantity || product.order_item?.quantity || 1}</p>
                                            <p className="order-item-price">${product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
