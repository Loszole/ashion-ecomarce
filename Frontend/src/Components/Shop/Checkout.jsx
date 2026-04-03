import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

const readCart = () => {
	try {
		const raw = localStorage.getItem("cart");
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
};

const Checkout = () => {
	const history = useHistory();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		paymentMethod: "cod",
		shippingCost: 0,
		taxAmount: 0
	});

	useEffect(() => {
		setItems(readCart());
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
	const shippingCost = subtotal > 100 ? 0 : parseFloat(form.shippingCost || 0);
	const taxAmount = parseFloat(form.taxAmount || (subtotal * 0.08).toFixed(2));
	const total = subtotal + shippingCost + taxAmount;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!form.fullName || !form.email || !form.address || !form.city) {
			setError("Please fill in all required fields");
			setLoading(false);
			return;
		}

		if (items.length === 0) {
			setError("Your cart is empty");
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {})
				},
				body: JSON.stringify({
					products: items.map(item => ({
						product: item._id,
						quantity: item.qty,
						price: item.price
					})),
					shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zipCode}`,
					paymentMethod: form.paymentMethod,
					shippingCost,
					taxAmount,
					contactName: form.fullName,
					contactEmail: form.email,
					contactPhone: form.phone
				})
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Failed to place order");
			}

			// Clear cart and redirect
			localStorage.removeItem("cart");
			window.dispatchEvent(new Event("cartUpdated"));
			alert("Order placed successfully!");
			history.push("/");
		} catch (err) {
			setError(err.message || "Failed to place order. Please try again.");
			console.error("Checkout error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="breadcrumb-option">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="breadcrumb__links">
								<Link to="/"><i className="fa fa-home"></i> Home</Link>
								<Link to="/cart">Shopping cart</Link>
								<span>Checkout</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<section className="checkout spad">
				<div className="container">
					{items.length === 0 ? (
						<div className="text-center py-5">
							<h3>Your cart is empty</h3>
							<Link to="/shop" className="primary-btn mt-3">Continue Shopping</Link>
						</div>
					) : (
						<div className="row">
							<div className="col-lg-8">
								<h5 className="mb-4">Shipping Information</h5>
								{error && <div className="alert alert-danger">{error}</div>}
								<form onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-md-6 mb-3">
											<label>Full Name *</label>
											<input
												type="text"
												className="form-control"
												name="fullName"
												value={form.fullName}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label>Email *</label>
											<input
												type="email"
												className="form-control"
												name="email"
												value={form.email}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									<div className="row">
										<div className="col-md-6 mb-3">
											<label>Phone</label>
											<input
												type="tel"
												className="form-control"
												name="phone"
												value={form.phone}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-6 mb-3">
											<label>Address *</label>
											<input
												type="text"
												className="form-control"
												name="address"
												value={form.address}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									<div className="row">
										<div className="col-md-4 mb-3">
											<label>City *</label>
											<input
												type="text"
												className="form-control"
												name="city"
												value={form.city}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="col-md-4 mb-3">
											<label>State</label>
											<input
												type="text"
												className="form-control"
												name="state"
												value={form.state}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-4 mb-3">
											<label>Zip Code</label>
											<input
												type="text"
												className="form-control"
												name="zipCode"
												value={form.zipCode}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="mb-4">
										<h5>Payment Method</h5>
										<div className="form-check">
											<input
												className="form-check-input"
												type="radio"
												name="paymentMethod"
												id="cod"
												value="cod"
												checked={form.paymentMethod === "cod"}
												onChange={handleChange}
											/>
											<label className="form-check-label" htmlFor="cod">
												Cash on Delivery
											</label>
										</div>
										<div className="form-check">
											<input
												className="form-check-input"
												type="radio"
												name="paymentMethod"
												id="card"
												value="stripe"
												checked={form.paymentMethod === "stripe"}
												onChange={handleChange}
											/>
											<label className="form-check-label" htmlFor="card">
												Credit/Debit Card
											</label>
										</div>
									</div>

									<button type="submit" className="primary-btn" disabled={loading}>
										{loading ? "Processing..." : "Place Order"}
									</button>
								</form>
							</div>

							<div className="col-lg-4">
								<h5 className="mb-4">Order Summary</h5>
								<div className="checkout__order">
									<ul>
										{items.map((item) => (
											<li key={item._id || item.name} className="d-flex justify-content-between">
												<span>{item.name} × {item.qty}</span>
												<span>${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}</span>
											</li>
										))}
									</ul>

									<div className="checkout__order__products">Subtotal: <span>${subtotal.toFixed(2)}</span></div>
									<div className="checkout__order__products">Shipping: <span>${shippingCost.toFixed(2)}</span></div>
									<div className="checkout__order__products">Tax: <span>${taxAmount.toFixed(2)}</span></div>
									<div className="checkout__order__total">Total: <span>${total.toFixed(2)}</span></div>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Checkout;
