import "./assects/css/bootstrap.min.css";
import "./assects/css/font-awesome.min.css";
import "./assects/css/elegant-icons.css";
import "./assects/css/jquery-ui.min.css";
import "./assects/css/magnific-popup.css";
import "./assects/css/owl.carousel.min.css";
import "./assects/css/slicknav.min.css";
import "./assects/css/style.css";
import NotFound from "./Components/Shop/NotFound";
import Cart from "./Components/Shop/Cart";
import Wishlist from "./Components/Shop/Wishlist";
import Preloader from "./Components/Shop/Preloader";

import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Header from "./Components/Shop/Header";
import Footer from "./Components/Shop/Footer";
import Home from "./Components/Shop/Home";

import Kids from "./Components/Shop/Kids";
import Womens from "./Components/Shop/Womens";
import Mens from "./Components/Shop/Mens";
import Shop from "./Components/Shop/Shop";
import Blog from "./Components/Shop/Blog";
import Contact from "./Components/Shop/Contact";
import Admin from "./Components/Admin/Admin";
import Login from "./Components/Shop/Login";
import Register from "./Components/Shop/Register";
import Prodect_Details from "./Components/Shop/Prodect_Details";
import Blog_Details from "./Components/Shop/Blog_Details";
import Checkout from "./Components/Shop/Checkout";
import OrdersTracking from "./Components/Shop/OrdersTracking";

const ADMIN_ROLES = ["admin", "superadmin", "editor"];

const getCurrentUser = () => {
	try {
		const raw = localStorage.getItem("user");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

const AdminRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			const user = getCurrentUser();
			if (user && ADMIN_ROLES.includes(user.role)) {
				return <Component {...props} />;
			}
			return <Redirect to="/login" />;
		}}
	/>
);

const withLayout = (Component) => (props) => (
	<>
		<Header />
		<main>
			<Component {...props} />
		</main>
		<Footer />
	</>
);


const App = () => {
   return (
	   <>
		   <Preloader />
		   <Router>
			   <Switch>
				   <AdminRoute path="/admin" component={Admin} />
				   <Route exact path="/" component={withLayout(Home)} />
				   <Route path="/shop" component={withLayout(Shop)} />
				   <Route path="/kids" component={withLayout(Kids)} />
				   <Route path="/womens" component={withLayout(Womens)} />
				   <Route path="/mens" component={withLayout(Mens)} />
				   <Route path="/blog" component={withLayout(Blog)} />
				   <Route path="/contact" component={withLayout(Contact)} />
				   <Route path="/login" component={withLayout(Login)} />
				   <Route path="/register" component={withLayout(Register)} />
				   <Route path="/cart" component={withLayout(Cart)} />
				   <Route path="/checkout" component={withLayout(Checkout)} />
				   <Route path="/orders-tracking" component={withLayout(OrdersTracking)} />
				   <Route path="/wishlist" component={withLayout(Wishlist)} />
				   <Route path="/product/:id" component={withLayout(Prodect_Details)} />
				   <Route path="/blog/:id" component={withLayout(Blog_Details)} />
				   <Route component={withLayout(NotFound)} />
			   </Switch>
		   </Router>
	   </>
   );
};

export default App;
