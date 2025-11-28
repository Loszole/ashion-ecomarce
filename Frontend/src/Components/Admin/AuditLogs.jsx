import React, { useEffect, useState } from "react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual API endpoint and auth if needed
    fetch("/api/audit-logs", {
      headers: {
        // 'Authorization': `Bearer ${token}` // Uncomment and set token if needed
      }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load audit logs");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="mb-4">Audit Logs / Activity Tracking</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
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
                    <td>{log.action}</td>
                    <td>
                      <pre className="mb-0" style={{fontSize: "0.9em"}}>{log.details ? JSON.stringify(log.details, null, 2) : "-"}</pre>
                    </td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
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

export default AuditLogs;
