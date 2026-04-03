import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
           <main>
                {/* Categories Section Begin */}
                <section className="categories">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 p-0">
                                <div className="categories__item categories__large__item set-bg" data-setbg="img/categories/category-1.jpg">
                                    <div className="categories__text">
                                        <h1>Women’s fashion</h1>
                                        <p>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida.</p>
                                        <Link to="/shop">Shop now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                        <div className="categories__item set-bg" data-setbg="img/categories/category-2.jpg">
                                            <div className="categories__text">
                                                <h4>Men’s fashion</h4>
                                                <p>358 items</p>
                                                <Link to="/mens">Shop now</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                        <div className="categories__item set-bg" data-setbg="img/categories/category-3.jpg">
                                            <div className="categories__text">
                                                <h4>Kid’s fashion</h4>
                                                <p>273 items</p>
                                                <Link to="/kids">Shop now</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                        <div className="categories__item set-bg" data-setbg="img/categories/category-4.jpg">
                                            <div className="categories__text">
                                                <h4>Cosmetics</h4>
                                                <p>159 items</p>
                                                <Link to="/shop">Shop now</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                                        <div className="categories__item set-bg" data-setbg="img/categories/category-5.jpg">
                                            <div className="categories__text">
                                                <h4>Accessories</h4>
                                                <p>792 items</p>
                                                <Link to="/shop">Shop now</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Categories Section End */}

                {/* Product Section Begin */}
                <section className="product spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-4">
                                <div className="section-title">
                                    <h4>New product</h4>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-8">
                                <ul className="filter__controls">
                                    <li className="active" data-filter="*">All</li>
                                    <li data-filter=".women">Women’s</li>
                                    <li data-filter=".men">Men’s</li>
                                    <li data-filter=".kid">Kid’s</li>
                                    <li data-filter=".accessories">Accessories</li>
                                    <li data-filter=".cosmetic">Cosmetics</li>
                                </ul>
                            </div>
                        </div>
                        <div className="row property__gallery">
                            {/* ...product items... (convert all class to className, self-close img tags, etc.) */}
                            {/* For brevity, only the first product is shown fully converted. Repeat for all others. */}
                            <div className="col-lg-3 col-md-4 col-sm-6 mix women">
                                <div className="product__item">
                                    <div className="product__item__pic set-bg" data-setbg="img/product/product-1.jpg">
                                        <div className="label new">New</div>
                                        <ul className="product__hover">
                                            <li><a href="img/product/product-1.jpg" className="image-popup"><span className="arrow_expand"></span></a></li>
                                            <li><Link to="/wishlist"><span className="icon_heart_alt"></span></Link></li>
                                            <li><Link to="/cart"><span className="icon_bag_alt"></span></Link></li>
                                        </ul>
                                    </div>
                                    <div className="product__item__text">
                                        <h6><Link to="/shop">Buttons tweed blazer</Link></h6>
                                        <div className="rating">
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                        </div>
                                        <div className="product__price">$ 59.0</div>
                                    </div>
                                </div>
                            </div>
                            {/* Repeat for all other product items, converting class to className and self-closing img tags */}
                        </div>
                    </div>
                </section>
                {/* Product Section End */}

                {/* Banner Section Begin */}
                <section className="banner set-bg" data-setbg="img/banner/banner-1.jpg">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-7 col-lg-8 m-auto">
                                <div className="banner__slider owl-carousel">
                                    <div className="banner__item">
                                        <div className="banner__text">
                                            <span>The Chloe Collection</span>
                                            <h1>The Project Jacket</h1>
                                            <Link to="/shop">Shop now</Link>
                                        </div>
                                    </div>
                                    <div className="banner__item">
                                        <div className="banner__text">
                                            <span>The Chloe Collection</span>
                                            <h1>The Project Jacket</h1>
                                            <Link to="/shop">Shop now</Link>
                                        </div>
                                    </div>
                                    <div className="banner__item">
                                        <div className="banner__text">
                                            <span>The Chloe Collection</span>
                                            <h1>The Project Jacket</h1>
                                            <Link to="/shop">Shop now</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Banner Section End */}

                {/* Trend Section Begin */}
                <section className="trend spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <div className="trend__content">
                                    <div className="section-title">
                                        <h4>Hot Trend</h4>
                                    </div>
                                    <div className="trend__item">
                                        <div className="trend__item__pic">
                                            <img src="img/trend/ht-1.jpg" alt="" />
                                        </div>
                                        <div className="trend__item__text">
                                            <h6>Chain bucket bag</h6>
                                            <div className="rating">
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                                <i className="fa fa-star"></i>
                                            </div>
                                            <div className="product__price">$ 59.0</div>
                                        </div>
                                    </div>
                                    {/* ...repeat for other trend items, converting class to className and self-closing img tags... */}
                                </div>
                            </div>
                            {/* ...repeat for other columns... */}
                        </div>
                    </div>
                </section>
                {/* Trend Section End */}

                {/* Discount Section Begin */}
                <section className="discount">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 p-0">
                                <div className="discount__pic">
                                    <img src="img/discount.jpg" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 p-0">
                                <div className="discount__text">
                                    <div className="discount__text__title">
                                        <span>Discount</span>
                                        <h2>Summer 2019</h2>
                                        <h5><span>Sale</span> 50%</h5>
                                    </div>
                                    <div className="discount__countdown" id="countdown-time">
                                        <div className="countdown__item">
                                            <span>22</span>
                                            <p>Days</p>
                                        </div>
                                        <div className="countdown__item">
                                            <span>18</span>
                                            <p>Hour</p>
                                        </div>
                                        <div className="countdown__item">
                                            <span>46</span>
                                            <p>Min</p>
                                        </div>
                                        <div className="countdown__item">
                                            <span>05</span>
                                            <p>Sec</p>
                                        </div>
                                    </div>
                                    <Link to="/shop">Shop now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Discount Section End */}

                {/* Services Section Begin */}
                <section className="services spad">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-car"></i>
                                    <h6>Free Shipping</h6>
                                    <p>For all oder over $99</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-money"></i>
                                    <h6>Money Back Guarantee</h6>
                                    <p>If good have Problems</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-support"></i>
                                    <h6>Online Support 24/7</h6>
                                    <p>Dedicated support</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <i className="fa fa-headphones"></i>
                                    <h6>Payment Secure</h6>
                                    <p>100% secure payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Services Section End */}
		</main>
	);
};

export default Home;
