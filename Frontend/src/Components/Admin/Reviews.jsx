import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const PAGE_SIZE = 10;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson("/api/reviews", { signal: controller.signal })
      .then(data => {
        setReviews(toArray(data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load reviews");
        setLoading(false);
      });

    return () => controller.abort();
  }, [success]);

  const handleModerate = (id, status) => {
    setSuccess("");
    setError(null);
    fetchAdminJson(`/api/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    })
      .then(data => {
        if (data && data._id) setSuccess("Review updated.");
        else setError("Failed to update review.");
      })
      .catch((err) => setError(err.message || "Failed to update review."));
  };

  const handleBulkModerate = (status) => {
    Promise.all(selected.map(id =>
      fetchAdminJson(`/api/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      })
    ))
      .then(() => {
        setSuccess("Bulk moderation complete.");
        setSelected([]);
      })
      .catch(() => setError("Bulk moderation failed."));
  };

  const filteredReviews = reviews.filter(r =>
    (filter === "all" || r.status === filter) &&
    (search === "" ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredReviews.length / PAGE_SIZE);
  const paginated = filteredReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === paginated.length) setSelected([]);
    else setSelected(paginated.map(r => r._id));
  };

  return (
    <div>
      <h2 className="mb-4">Reviews / Feedback Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3 d-flex align-items-center gap-3">
        <label className="form-label me-2">Filter:</label>
        <select className="form-select w-auto" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input className="form-control w-auto" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <button className="btn btn-outline-success btn-sm" disabled={selected.length === 0} onClick={() => handleBulkModerate("approved")}>Bulk Approve</button>
        <button className="btn btn-outline-danger btn-sm" disabled={selected.length === 0} onClick={() => handleBulkModerate("rejected")}>Bulk Reject</button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={handleSelectAll} /></th>
              <th>User</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="8" className="text-center">No reviews found.</td></tr>
            ) : (
              paginated.map((r, idx) => (
                <tr key={r._id || idx}>
                  <td><input type="checkbox" checked={selected.includes(r._id)} onChange={() => handleSelect(r._id)} /></td>
                  <td>{r.user?.name || "-"}</td>
                  <td>{r.product?.name || "-"}</td>
                  <td>{Number(r.rating || 0)} / 5</td>
                  <td style={{maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{r.comment}</td>
                  <td>
                    <span className={`badge bg-${r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning text-dark"}`}>
                      {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Pending"}
                    </span>
                  </td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    {r.status === "pending" && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleModerate(r._id, "approved")}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleModerate(r._id, "rejected")}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item${page === i + 1 ? " active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Reviews;
