import React, { useState } from "react";
import { Link } from "react-router-dom";

const readCart = () => {
    try {
        const raw = localStorage.getItem("cart");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
};

const Cart = () => {
    const [items, setItems] = useState(readCart);

    const updateQty = (id, qty) => {
        const updated = items.map((item) =>
            item._id === id ? { ...item, qty: Math.max(1, qty) } : item
        );
        setItems(updated);
        saveCart(updated);
    };

    const removeItem = (id) => {
        const updated = items.filter((item) => item._id !== id);
        setItems(updated);
        saveCart(updated);
    };

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);

    return (
        <div>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <span>Shopping cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="shop-cart spad">
                <div className="container">
                    {items.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="icon_bag_alt" style={{ fontSize: 40 }}></i>
                            <p className="mt-3">Your cart is empty.</p>
                            <Link to="/shop" className="primary-btn">Continue Shopping</Link>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="shop__cart__table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item._id || item.name}>
                                                        <td className="cart__product__item">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name || "Product"}
                                                                    style={{ width: 60, marginRight: 12 }}
                                                                />
                                                            ) : null}
                                                            <div className="cart__product__item__title">
                                                                <h6>{item.name || "Untitled Product"}</h6>
                                                            </div>
                                                        </td>
                                                        <td className="cart__price">$ {Number(item.price || 0).toFixed(2)}</td>
                                                        <td className="cart__quantity">
                                                            <div className="pro-qty">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.qty || 1}
                                                                    onChange={(e) => updateQty(item._id, parseInt(e.target.value, 10) || 1)}
                                                                    style={{ width: 60 }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="cart__total">$ {(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}</td>
                                                        <td className="cart__close">
                                                            <span
                                                                className="icon_close"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => removeItem(item._id)}
                                                            ></span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="cart__btn">
                                        <Link to="/shop">Continue Shopping</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-4 offset-lg-8">
                                    <div className="cart__total__procced">
                                        <h6>Cart total</h6>
                                        <ul>
                                            <li>Subtotal <span>$ {subtotal.toFixed(2)}</span></li>
                                            <li>Total <span>$ {subtotal.toFixed(2)}</span></li>
                                        </ul>
                                        <Link to="/checkout" className="primary-btn">Proceed to checkout</Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Cart;
