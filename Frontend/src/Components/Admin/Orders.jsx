
import React, { useEffect, useState } from "react";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Replace with your actual API endpoint and auth if needed
		fetch("/api/orders", {
			headers: {
				// 'Authorization': `Bearer ${token}` // Uncomment and set token if needed
			}
		})
			.then(res => res.json())
			.then(data => {
				setOrders(data);
				setLoading(false);
			})
			.catch(err => {
				setError("Failed to load orders");
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<h2 className="mb-4">Orders</h2>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<div className="table-responsive">
					<table className="table table-striped table-hover align-middle">
						<thead>
							<tr>
								<th>Order ID</th>
								<th>User</th>
								<th>Products</th>
								<th>Total</th>
								<th>Status</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.length === 0 ? (
								<tr><td colSpan="6" className="text-center">No orders found.</td></tr>
							) : (
								orders.map((order, idx) => (
									<tr key={order._id || idx}>
										<td>{order._id}</td>
										<td>{order.user?.name || "-"}</td>
										<td>
											<ul className="mb-0 ps-3">
												{order.products.map((item, i) => (
													<li key={i}>{item.product?.name || "-"} <span className="text-muted">x{item.quantity}</span></li>
												))}
											</ul>
										</td>
										<td>${order.total.toLocaleString()}</td>
										<td>
											<span className={`badge bg-${order.status === "pending" ? "warning text-dark" : order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "info"}`}>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</td>
										<td>{new Date(order.createdAt).toLocaleString()}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Orders;
