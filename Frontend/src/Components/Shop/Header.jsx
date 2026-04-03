      import React, { useState, useEffect } from "react";
        import { Link, useHistory } from "react-router-dom";
        import logo from "../../assects/img/logo.png";

        const Header = () => {
            const [user, setUser] = useState(null);
            const [cartCount, setCartCount] = useState(0);
            const history = useHistory();

            useEffect(() => {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
                }
                const syncCart = () => {
                    const c = localStorage.getItem("cart");
                    try {
                        const items = c ? JSON.parse(c) : [];
                        setCartCount(Array.isArray(items) ? items.reduce((s, i) => s + (i.qty || 1), 0) : 0);
                    } catch { setCartCount(0); }
                };
                syncCart();
                window.addEventListener("cartUpdated", syncCart);
                return () => window.removeEventListener("cartUpdated", syncCart);
            }, []);

            const handleLogout = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("cart");
                setUser(null);
                setCartCount(0);
                history.push("/");
            };

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
                                    {user ? (
                                        <>
                                            <span style={{ marginRight: 8 }}>Hi, {user.name}</span>
                                            <button
                                                onClick={handleLogout}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">Login</Link>
                                            <Link to="/register">Register</Link>
                                        </>
                                    )}
                                </div>
                                <ul className="header__right__widget">
                                    <li>
                                        <span className="icon_search search-switch"></span>
                                    </li>
                                    <li>
                                        <Link to="/wishlist">
                                            <span className="icon_heart_alt"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/cart">
                                            <span className="icon_bag_alt"></span>
                                            {cartCount > 0 && <div className="tip">{cartCount}</div>}
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
