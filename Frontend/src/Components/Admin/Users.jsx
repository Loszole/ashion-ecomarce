import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson(`/api/users?page=${page}&limit=${limit}`, { signal: controller.signal })
      .then(data => {
        setUsers(toArray(data));
        setTotalPages(data.meta?.pages || data.pagination?.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load users");
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
      <h2 className="mb-4">Users / Customers</h2>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No users found.</td></tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user._id || idx}>
                      <td>{user.name || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.role || "user"}</td>
                      <td>
                        <span className={`badge bg-${user.active ? "success" : "secondary"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
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

export default Users;
