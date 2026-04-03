import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductPrimaryImage } from "../../utils/imageUrl";

const readCart = () => {
    try {
        const raw = localStorage.getItem("cart");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

function Kids() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 9;

    const addToCart = (product) => {
        const items = readCart();
        const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");
        const existing = items.find((item) => item._id === product._id);

        const next = existing
            ? items.map((item) =>
                  item._id === product._id ? { ...item, qty: Number(item.qty || 1) + 1 } : item
              )
            : [
                  ...items,
                  {
                      _id: product._id,
                      name: product.name,
                      price: Number(product.price || 0),
                      image,
                      qty: 1
                  }
              ];

        localStorage.setItem("cart", JSON.stringify(next));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/products?category=kid&page=${page}&limit=${pageSize}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.data || []);
                setTotalPages((data.meta && data.meta.pages) || 1);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load products.");
                setLoading(false);
            });
    }, [page]);

    return (
        <section className="shop spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <aside>
                            <div className="shop__sidebar">
                                <div className="sidebar__categories">
                                    <div className="section-title">
                                        <h4>CATEGORIES</h4>
                                    </div>
                                    <div className="categories__accordion">
                                        <div className="accordion" id="accordionExample">
                                            <div className="card">
                                                <div className="card-heading active">
                                                    <a href="/#" data-toggle="collapse" data-target="#collapsekid" onClick={(e) => e.preventDefault()}>Kids</a>
                                                </div>
                                                <div id="collapsekid" className="collapse show" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><Link to="/kids">Coats</Link></li>
                                                            <li><Link to="/kids">Jackets</Link></li>
                                                            <li><Link to="/kids">Shirts</Link></li>
                                                            <li><Link to="/kids">T-shirts</Link></li>
                                                            <li><Link to="/kids">Jeans</Link></li>
                                                            <li><Link to="/kids">Accessories</Link></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="col-lg-9 col-md-9">
                        {loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <div className="row">
                                {products.map((product) => {
                                    const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");

                                    return (
                                        <div className="col-lg-4 col-md-6 col-sm-6" key={product._id}>
                                            <div className="product__item">
                                                <div
                                                    className="product__item__pic set-bg"
                                                    style={{ backgroundImage: `url(${image})` }}
                                                >
                                                    <ul className="product__hover">
                                                        <li>
                                                            <a href={image} className="image-popup"><span className="arrow_expand"></span></a>
                                                        </li>
                                                        <li><Link to="/wishlist"><span className="icon_heart_alt"></span></Link></li>
                                                        <li>
                                                            <button type="button" className="btn p-0" onClick={() => addToCart(product)}>
                                                                <span className="icon_bag_alt"></span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="product__item__text">
                                                    <h6><Link to={`/product/${product._id}`}>{product.name}</Link></h6>
                                                    <div className="product__price">$ {Number(product.price || 0).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="col-lg-12 text-center">
                                    <div className="pagination__option">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                className={page === i + 1 ? "active" : ""}
                                                onClick={() => setPage(i + 1)}
                                                aria-label={`Go to page ${i + 1}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Kids;
