import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrdersTracking = () => {
    const [form, setForm] = useState({ orderId: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [order, setOrder] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [myOrdersLoading, setMyOrdersLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        const loadMyOrders = async () => {
            setMyOrdersLoading(true);
            try {
                const res = await fetch("/api/orders/my", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.message || "Unable to load your orders.");
                }

                setMyOrders(Array.isArray(data.data) ? data.data : []);
            } catch {
                setMyOrders([]);
            } finally {
                setMyOrdersLoading(false);
            }
        };

        loadMyOrders();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await fetch("/api/orders/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: form.orderId.trim(),
                    email: form.email.trim()
                })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.message || "Unable to track order.");
            }

            setOrder(data.data || null);
        } catch (err) {
            setError(err.message || "Unable to track order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Orders Tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="checkout spad">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h4 className="mb-4">Track Your Order</h4>

                            {(myOrdersLoading || myOrders.length > 0) && (
                                <div className="card p-3 mb-4">
                                    <h5 className="mb-3">My Recent Orders</h5>
                                    {myOrdersLoading ? (
                                        <p className="mb-0">Loading your orders...</p>
                                    ) : (
                                        <ul className="mb-0">
                                            {myOrders.slice(0, 5).map((item) => (
                                                <li key={item._id}>
                                                    <strong>{item._id}</strong> - {item.status} - ${Number(item.total || 0).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Order ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="orderId"
                                            value={form.orderId}
                                            onChange={handleChange}
                                            placeholder="Enter your order id"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Enter checkout email"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="primary-btn" disabled={loading}>
                                    {loading ? "Checking..." : "Track Order"}
                                </button>
                            </form>

                            {order && (
                                <div className="card p-3">
                                    <h5 className="mb-3">Order Summary</h5>
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                                    <p><strong>Total:</strong> ${Number(order.total || 0).toFixed(2)}</p>
                                    <p><strong>Placed:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</p>
                                    <p><strong>Shipping Address:</strong> {order.shippingAddress || "-"}</p>

                                    <h6 className="mt-3">Items</h6>
                                    <ul className="mb-0">
                                        {(order.products || []).map((item, idx) => (
                                            <li key={idx}>
                                                {item.name} x {item.quantity} - ${Number(item.price || 0).toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OrdersTracking;
