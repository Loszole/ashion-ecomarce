import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson(`/api/audit-logs?page=${page}&limit=${limit}`, { signal: controller.signal })
      .then(data => {
        setLogs(toArray(data));
        setTotalPages(data.pagination?.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load audit logs");
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
      <h2 className="mb-4">Audit Logs / Activity Tracking</h2>
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
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No audit logs found.</td></tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={log._id || idx}>
                      <td>{log.user?.name || "-"}</td>
                      <td>{log.user?.email || "-"}</td>
                      <td>{log.user?.role || "-"}</td>
                      <td>{log.action || "-"}</td>
                      <td>
                        <pre className="mb-0" style={{fontSize: "0.9em"}}>{log.details ? JSON.stringify(log.details, null, 2) : "-"}</pre>
                      </td>
                      <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</td>
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

export default AuditLogs;
