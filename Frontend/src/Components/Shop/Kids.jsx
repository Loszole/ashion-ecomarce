import React, { useEffect, useState } from "react";

const kids = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/products?category=kid&page=${page}&limit=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setTotalPages(data.totalPages || 1);
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
                                {/* Categories */}
                                <div className="sidebar__categories">
                                    <div className="section-title">
                                        <h4>CATEGORIES</h4>
                                    </div>
                                    <div className="categories__accordion">
                                        <div className="accordion" id="accordionExample">
                                            <div className="card">
                                                <div className="card-heading active">
                                                    <a data-toggle="collapse" data-target="#collapsekid">kid</a>
                                                </div>
                                                <div id="collapsekid" className="collapse show" data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                            <li><a href="#">Accessories</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Shop by price */}
                                <div className="sidebar__filter">
                                    <div className="section-title">
                                        <h4>SHOP BY PRICE</h4>
                                    </div>
                                    <div className="filter-range-wrap">
                                        <div className="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" data-min="33" data-max="99"></div>
                                        <div className="range-slider">
                                            <div className="price-input">
                                                <span>Price: د.إ33-د.إ99</span>
                                                <button className="btn btn-outline-dark ml-2" style={{marginLeft: '10px', border: '1px solid #d32f2f', color: '#d32f2f', fontWeight: 'bold'}}>FILTER</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Shop by size */}
                                <div className="sidebar__sizes">
                                    <div className="section-title">
                                        <h4>SHOP BY SIZE</h4>
                                    </div>
                                    <div className="size__list">
                                        {['XXS','XS','XS-S','S','M','M-L','L','XL'].map(size => (
                                            <label key={size} htmlFor={size.toLowerCase().replace(/[^a-z0-9]/g,'')}>
                                                {size}
                                                <input type="checkbox" id={size.toLowerCase().replace(/[^a-z0-9]/g,'')} />
                                                <span className="checkmark"></span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Shop by colour */}
                                <div className="sidebar__color">
                                    <div className="section-title">
                                        <h4>SHOP BY COLOUR</h4>
                                    </div>
                                    <div className="size__list color__list">
                                        {['Blacks','Whites','Reds','Greys','Blues','Beige Tones','Greens','Yellows'].map(color => (
                                            <label key={color} htmlFor={color.toLowerCase().replace(/[^a-z0-9]/g,'')}>
                                                {color}
                                                <input type="checkbox" id={color.toLowerCase().replace(/[^a-z0-9]/g,'')} />
                                                <span className="checkmark"></span>
                                            </label>
                                        ))}
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
                                {products.map(product => (
                                    <div className="col-lg-4 col-md-6 col-sm-6" key={product._id}>
                                        <div className="product__item">
                                            <div className="product__item__pic set-bg" style={{ backgroundImage: `url(${product.image})` }}>
                                                <ul className="product__hover">
                                                    <li><a href={product.image} className="image-popup"><span className="arrow_expand"></span></a></li>
                                                    <li><a href="#"><span className="icon_heart_alt"></span></a></li>
                                                    <li><a href="#"><span className="icon_bag_alt"></span></a></li>
                                                </ul>
                                            </div>
                                            <div className="product__item__text">
                                                <h6><a href="#">{product.name}</a></h6>
                                                <div className="rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`fa fa-star${i < (product.rating || 0) ? "" : "-o"}`}></i>
                                                    ))}
                                                </div>
                                                <div className="product__price">د.إ {product.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-lg-12 text-center">
                                    <div className="pagination__option">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <a
                                                href="#"
                                                key={i}
                                                className={page === i + 1 ? "active" : ""}
                                                onClick={e => { e.preventDefault(); setPage(i + 1); }}
                                            >
                                                {i + 1}
                                            </a>
                                        ))}
                                        {page < totalPages && (
                                            <a href="#" onClick={e => { e.preventDefault(); setPage(page + 1); }}>
                                                <i className="fa fa-angle-right"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default kids;
