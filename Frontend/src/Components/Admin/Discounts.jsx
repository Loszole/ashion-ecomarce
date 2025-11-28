import React, { useEffect, useState } from "react";

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ code: "", amount: 0, type: "percent", expires: "" });
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ code: "", amount: 0, type: "percent", expires: "" });
  const [filter, setFilter] = useState({ status: "all", type: "all", code: "" });

  useEffect(() => {
    fetch("/api/discounts")
      .then(res => res.json())
      .then(data => {
        setDiscounts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load discounts");
        setLoading(false);
      });
  }, [success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError(null);
    fetch("/api/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setSuccess("Discount created successfully.");
          setForm({ code: "", amount: 0, type: "percent", expires: "" });
        } else {
          setError("Failed to create discount.");
        }
      })
      .catch(() => setError("Failed to create discount."));
  };

  const handleEdit = (d) => {
    setEditId(d._id);
    setEditForm({ code: d.code, amount: d.amount, type: d.type, expires: d.expires ? d.expires.slice(0, 10) : "" });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    fetch(`/api/discounts/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setSuccess("Discount updated.");
          setEditId(null);
        } else {
          setError("Failed to update discount.");
        }
      })
      .catch(() => setError("Failed to update discount."));
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this discount?")) return;
    fetch(`/api/discounts/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setSuccess("Discount deleted."))
      .catch(() => setError("Failed to delete discount."));
  };

  const filtered = discounts.filter(d =>
    (filter.status === "all" || (d.expires && new Date(d.expires) < new Date() ? "expired" : "active") === filter.status) &&
    (filter.type === "all" || d.type === filter.type) &&
    (filter.code === "" || d.code.toLowerCase().includes(filter.code.toLowerCase()))
  );

  return (
    <div>
      <h2 className="mb-4">Discounts / Coupons Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label">Code</label>
            <input type="text" className="form-control" name="code" value={form.code} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Amount</label>
            <input type="number" className="form-control" name="amount" min="1" value={form.amount} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Type</label>
            <select className="form-select" name="type" value={form.type} onChange={handleChange} required>
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Expires</label>
            <input type="date" className="form-control" name="expires" value={form.expires} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Create</button>
          </div>
        </form>
      </div>
      <div className="mb-3 d-flex align-items-center gap-3">
        <label>Status:</label>
        <select className="form-select w-auto" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <label>Type:</label>
        <select className="form-select w-auto" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="all">All</option>
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
        <input className="form-control w-auto" placeholder="Search code..." value={filter.code} onChange={e => setFilter(f => ({ ...f, code: e.target.value }))} />
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Code</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No discounts found.</td></tr>
            ) : (
              filtered.map((d, idx) => (
                <tr key={d._id || idx}>
                  {editId === d._id ? (
                    <>
                      <td><input type="text" className="form-control" name="code" value={editForm.code} onChange={handleEditChange} required /></td>
                      <td><input type="number" className="form-control" name="amount" value={editForm.amount} onChange={handleEditChange} required /></td>
                      <td>
                        <select className="form-select" name="type" value={editForm.type} onChange={handleEditChange} required>
                          <option value="percent">Percent</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </td>
                      <td><input type="date" className="form-control" name="expires" value={editForm.expires} onChange={handleEditChange} /></td>
                      <td colSpan={2}></td>
                      <td>
                        <button className="btn btn-success btn-sm me-2" onClick={handleEditSubmit}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{d.code}</td>
                      <td>{d.type === "percent" ? `${d.amount}%` : `$${d.amount}`}</td>
                      <td>{d.type.charAt(0).toUpperCase() + d.type.slice(1)}</td>
                      <td>{d.expires ? new Date(d.expires).toLocaleDateString() : "-"}</td>
                      <td>
                        <span className={`badge bg-${d.expires && new Date(d.expires) < new Date() ? "secondary" : "success"}`}>
                          {d.expires && new Date(d.expires) < new Date() ? "Expired" : "Active"}
                        </span>
                      </td>
                      <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-link btn-sm me-2" onClick={() => handleEdit(d)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Discounts;
