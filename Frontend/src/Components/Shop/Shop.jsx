import React, { useState, useEffect } from "react";
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

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const pageSize = 9;

    const addToCart = (product) => {
        const items = readCart();
        const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");
        const existing = items.find((item) => item._id === product._id);

        const next = existing
            ? items.map((item) =>
                  item._id === product._id ? { ...item, qty: Number(item.qty || 1) + 1 } : item
              )
            : [...items, { _id: product._id, name: product.name, price: Number(product.price || 0), image, qty: 1 }];

        localStorage.setItem("cart", JSON.stringify(next));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ page, limit: pageSize });
        if (search) params.set("search", search);
        fetch(`/api/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.data || []);
                setTotalPages((data.meta && data.meta.pages) || 1);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load products.");
                setLoading(false);
            });
    }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    return (
        <section className="shop spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <div className="shop__sidebar">
                            <div className="sidebar__categories">
                                <div className="section-title">
                                    <h4>Categories</h4>
                                </div>
                                <div className="categories__accordion">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card">
                                            <div className="card-heading active">
                                                <a href="/#" data-toggle="collapse" data-target="#collapseOne" onClick={e => e.preventDefault()}>Women</a>
                                            </div>
                                            <div id="collapseOne" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <ul>
                                                        <li><Link to="/womens">Coats</Link></li>
                                                        <li><Link to="/womens">Jackets</Link></li>
                                                        <li><Link to="/womens">Dresses</Link></li>
                                                        <li><Link to="/womens">Shirts</Link></li>
                                                        <li><Link to="/womens">T-shirts</Link></li>
                                                        <li><Link to="/womens">Jeans</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a href="/#" data-toggle="collapse" data-target="#collapseTwo" onClick={e => e.preventDefault()}>Men</a>
                                            </div>
                                            <div id="collapseTwo" className="collapse" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <ul>
                                                        <li><Link to="/mens">Coats</Link></li>
                                                        <li><Link to="/mens">Jackets</Link></li>
                                                        <li><Link to="/mens">Shirts</Link></li>
                                                        <li><Link to="/mens">T-shirts</Link></li>
                                                        <li><Link to="/mens">Jeans</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a href="/#" data-toggle="collapse" data-target="#collapseThree" onClick={e => e.preventDefault()}>Kids</a>
                                            </div>
                                            <div id="collapseThree" className="collapse" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <ul>
                                                        <li><Link to="/kids">Coats</Link></li>
                                                        <li><Link to="/kids">Jackets</Link></li>
                                                        <li><Link to="/kids">Shirts</Link></li>
                                                        <li><Link to="/kids">T-shirts</Link></li>
                                                        <li><Link to="/kids">Jeans</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a href="/#" data-toggle="collapse" data-target="#collapseFour" onClick={e => e.preventDefault()}>Accessories</a>
                                            </div>
                                            <div id="collapseFour" className="collapse" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <ul>
                                                        <li><Link to="/shop">Bags</Link></li>
                                                        <li><Link to="/shop">Belts</Link></li>
                                                        <li><Link to="/shop">Hats</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a href="/#" data-toggle="collapse" data-target="#collapseFive" onClick={e => e.preventDefault()}>Cosmetic</a>
                                            </div>
                                            <div id="collapseFive" className="collapse" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <ul>
                                                        <li><Link to="/shop">Skin Care</Link></li>
                                                        <li><Link to="/shop">Makeup</Link></li>
                                                        <li><Link to="/shop">Fragrance</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar__filter">
                                <div className="section-title">
                                    <h4>Shop by price</h4>
                                </div>
                                <div className="filter-range-wrap">
                                    <div className="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content"
                                        data-min="33" data-max="99"></div>
                                    <div className="range-slider">
                                        <div className="price-input">
                                            <p>Price:</p>
                                            <input type="text" id="minamount" readOnly />
                                            <input type="text" id="maxamount" readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar__sizes">
                                <div className="section-title">
                                    <h4>Shop by size</h4>
                                </div>
                                <div className="size__list">
                                    {["xxs","xs","xs-s","s","m","m-l","l","xl"].map(size => (
                                        <label key={size} htmlFor={`size-${size.replace(/[^a-z0-9]/g,"")}`}>
                                            {size}
                                            <input type="checkbox" id={`size-${size.replace(/[^a-z0-9]/g,"")}`} />
                                            <span className="checkmark"></span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="sidebar__color">
                                <div className="section-title">
                                    <h4>Shop by color</h4>
                                </div>
                                <div className="size__list color__list">
                                    {["Blacks","Whites","Reds","Greys","Blues","Beige Tones","Greens","Yellows"].map(color => (
                                        <label key={color} htmlFor={`color-${color.toLowerCase().replace(/[^a-z0-9]/g,"")}`}>
                                            {color}
                                            <input type="checkbox" id={`color-${color.toLowerCase().replace(/[^a-z0-9]/g,"")}`} />
                                            <span className="checkmark"></span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-9">
                        <form className="mb-3 d-flex" onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <button type="submit" className="btn btn-dark" style={{ marginLeft: 8 }}>Search</button>
                        </form>
                        {loading ? (
                            <div className="text-center py-5">Loading...</div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-5">No products found.</div>
                        ) : (
                            <div className="row">
                                {products.map((product) => {
                                    const image = getProductPrimaryImage(product, "/img/product/product-1.jpg");

                                    return (
                                        <div className="col-lg-4 col-md-6" key={product._id}>
                                            <div className="product__item">
                                                <div
                                                    className="product__item__pic set-bg"
                                                    style={{ backgroundImage: `url(${image})` }}
                                                >
                                                    <ul className="product__hover">
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
                                                    <div className="product__price">$ {product.price}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {totalPages > 1 && (
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
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Shop;
