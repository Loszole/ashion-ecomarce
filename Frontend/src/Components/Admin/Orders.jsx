
import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 20;

	useEffect(() => {
		const controller = new AbortController();

		fetchAdminJson(`/api/orders/list?page=${page}&limit=${limit}`, { signal: controller.signal })
			.then(data => {
				setOrders(toArray(data));
				setTotalPages(data.meta?.pages || data.pagination?.pages || 1);
				setLoading(false);
			})
			.catch(err => {
				if (err.name === "AbortError") return;
				setError(err.message || "Failed to load orders");
				setLoading(false);
			});

		return () => controller.abort();
	}, [page]);

	const handlePrevPage = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1);
	};

	return (
		<div>
			<h2 className="mb-4">Orders</h2>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="text-danger">{error}</div>
			) : (
				<>
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
											<td>
												<div>{order.user?.name || order.customer?.name || order.contactName || "Guest checkout"}</div>
												<small className="text-muted">{order.user?.email || order.customer?.email || order.contactEmail || "-"}</small>
											</td>
											<td>
												<ul className="mb-0 ps-3">
													{toArray(order.products).map((item, i) => (
														<li key={i}>{item.product?.name || "-"} <span className="text-muted">x{item.quantity}</span></li>
													))}
												</ul>
											</td>
											<td>${Number(order.total || 0).toLocaleString()}</td>
											<td>
												<span className={`badge bg-${order.status === "pending" ? "warning text-dark" : order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "info"}`}>
													{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
												</span>
											</td>
											<td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-between align-items-center mt-3">
						<small className="text-muted">Page {page} of {totalPages}</small>
						<div>
							<button className="btn btn-sm btn-outline-secondary" onClick={handlePrevPage} disabled={page === 1}>
								Previous
							</button>
							<button className="btn btn-sm btn-outline-secondary ms-2" onClick={handleNextPage} disabled={page >= totalPages}>
								Next
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Orders;
