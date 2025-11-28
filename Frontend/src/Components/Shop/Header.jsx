      import React from "react";
        import { Link } from "react-router-dom";
        import logo from "../../assects/img/logo.png";

        const Header = () => {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-3 col-lg-2">
                            <div className="header__logo">
                                <Link to="/">
                                    <img src={logo} alt="Logo" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <nav className="header__menu">
                                <ul>
                                    <li className="active">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/womens">Women’s</Link>
                                    </li>
                                    <li>
                                        <Link to="/mens">Men’s</Link>
                                    </li>
                                    <li>
                                        <Link to="/shop">Shop</Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">Blog</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">Contact</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__right">
                                <div className="header__right__auth">
                                    <Link to="/login">Login</Link>
                                    <Link to="/register">Register</Link>
                                </div>
                                <ul className="header__right__widget">
                                    <li>
                                        <span className="icon_search search-switch"></span>
                                    </li>
                                    <li>
                                        <Link to="/wishlist">
                                            <span className="icon_heart_alt"></span>
                                            <div className="tip">2</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/cart">
                                            <span className="icon_bag_alt"></span>
                                            <div className="tip">2</div>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="canvas__open">
                        <span className="fa fa-bars"></span>
                    </div>
                </div>
            );
        };

        export default Header;
