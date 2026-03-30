import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assects/img/logo.png";
import payment1 from "../../assects/img/payment/payment-1.png";
import payment2 from "../../assects/img/payment/payment-2.png";
import payment3 from "../../assects/img/payment/payment-3.png";
import payment4 from "../../assects/img/payment/payment-4.png";
import payment5 from "../../assects/img/payment/payment-5.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-7">
                        <div className="footer__about">
                            <div className="footer__logo">
                                <img src={logo} alt="Logo" />
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt cilisis.
                            </p>
                            <div className="footer__payment">
                                <img src={payment1} alt="Payment 1" />
                                <img src={payment2} alt="Payment 2" />
                                <img src={payment3} alt="Payment 3" />
                                <img src={payment4} alt="Payment 4" />
                                <img src={payment5} alt="Payment 5" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-5">
                        <div className="footer__widget">
                            <h6>Quick links</h6>
                            <ul>
                                <li><Link to="/">About</Link></li>
                                <li><Link to="/blog">Blogs</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/contact">FAQ</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4">
                        <div className="footer__widget">
                            <h6>Account</h6>
                            <ul>
                                <li><Link to="/login">My Account</Link></li>
                                <li><Link to="/orders-tracking">Orders Tracking</Link></li>
                                <li><Link to="/checkout">Checkout</Link></li>
                                <li><Link to="/wishlist">Wishlist</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-8 col-sm-8">
                        <div className="footer__newslatter">
                            <h6>NEWSLETTER</h6>
                            <form onSubmit={e => e.preventDefault()}>
                                <input type="text" placeholder="Email" />
                                <button type="submit" className="site-btn">Subscribe</button>
                            </form>
                            <div className="footer__social">
                                <a href="#" aria-label="Facebook"><span className="fa fa-facebook" /></a>
                                <a href="#" aria-label="Twitter"><span className="fa fa-twitter" /></a>
                                <a href="#" aria-label="YouTube"><span className="fa fa-youtube-play" /></a>
                                <a href="#" aria-label="Instagram"><span className="fa fa-instagram" /></a>
                                <a href="#" aria-label="Pinterest"><span className="fa fa-pinterest" /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="footer__copyright__text">
                            <p>
                                Copyright &copy; {currentYear} All rights reserved | This site is made with <span className="fa fa-heart" aria-hidden="true" style={{color: 'red'}}></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
