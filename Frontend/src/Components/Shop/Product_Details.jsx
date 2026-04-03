import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductPrimaryImage } from "../../utils/imageUrl";

const readCart = () => {
    try {
        const raw = localStorage.getItem("cart");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const Product_Details = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(`/api/products/${id}`, { signal: controller.signal })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.message || "Failed to load product");
                }
                return data;
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                setError(err.message || "Failed to load product");
                setLoading(false);
            });

        return () => controller.abort();
    }, [id]);

    const addToCart = () => {
        if (!product) return;

        const items = readCart();
        const existing = items.find((item) => item._id === product._id);
        const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");

        const next = existing
            ? items.map((item) =>
                  item._id === product._id ? { ...item, qty: item.qty + qty } : item
              )
            : [
                  ...items,
                  {
                      _id: product._id,
                      name: product.name,
                      price: Number(product.price || 0),
                      image,
                      qty
                  }
              ];

        localStorage.setItem("cart", JSON.stringify(next));
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Added to cart");
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!product) return <div className="text-center py-5">Product not found.</div>;

    const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");

    return (
        <main>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                                <Link to="/shop">Shop</Link>
                                <span>{product.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="product__details__pic">
                                <img src={image} alt={product.name} className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="product__details__text">
                                <h3>{product.name}</h3>
                                <div className="product__details__price">$ {Number(product.price || 0).toFixed(2)}</div>
                                <p>{product.description || "No description available."}</p>
                                <p><strong>Category:</strong> {product.category || "General"}</p>
                                <p><strong>Stock:</strong> {Number(product.stock || 0)}</p>

                                <div className="product__details__button">
                                    <div className="quantity">
                                        <span>Quantity:</span>
                                        <div className="pro-qty">
                                            <input
                                                type="number"
                                                min="1"
                                                max={Math.max(1, Number(product.stock || 1))}
                                                value={qty}
                                                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                                            />
                                        </div>
                                    </div>
                                    <button type="button" className="cart-btn" onClick={addToCart}>
                                        <span className="icon_bag_alt"></span> Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Product_Details;
