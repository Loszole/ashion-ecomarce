import React, { useEffect, useState } from "react";

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: "", type: "blog", content: "" });
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", type: "blog", content: "" });

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load content");
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
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setSuccess("Content saved successfully.");
          setForm({ title: "", type: "blog", content: "" });
        } else {
          setError("Failed to save content.");
        }
      })
      .catch(() => setError("Failed to save content."));
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setEditForm({ title: post.title, type: post.type, content: post.content });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    fetch(`/api/content/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setSuccess("Content updated.");
          setEditId(null);
        } else {
          setError("Failed to update content.");
        }
      })
      .catch(() => setError("Failed to update content."));
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this content?")) return;
    fetch(`/api/content/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setSuccess("Content deleted."))
      .catch(() => setError("Failed to delete content."));
  };

  return (
    <div>
      <h2 className="mb-4">Content Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Type</label>
            <select className="form-select" name="type" value={form.type} onChange={handleChange} required>
              <option value="blog">Blog Post</option>
              <option value="page">Static Page</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Content</label>
            <textarea className="form-control" name="content" value={form.content} onChange={handleChange} rows={3} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Content</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No content found.</td></tr>
            ) : (
              posts.map((p, idx) => (
                <tr key={p._id || idx}>
                  {editId === p._id ? (
                    <>
                      <td colSpan={5}>
                        <form className="row g-2 align-items-end" onSubmit={handleEditSubmit}>
                          <div className="col-md-3">
                            <input type="text" className="form-control" name="title" value={editForm.title} onChange={handleEditChange} required />
                          </div>
                          <div className="col-md-2">
                            <select className="form-select" name="type" value={editForm.type} onChange={handleEditChange} required>
                              <option value="blog">Blog Post</option>
                              <option value="page">Static Page</option>
                            </select>
                          </div>
                          <div className="col-md-5">
                            <textarea className="form-control" name="content" value={editForm.content} onChange={handleEditChange} rows={3} required />
                          </div>
                          <div className="col-md-2 d-flex gap-2">
                            <button type="submit" className="btn btn-success w-50">Save</button>
                            <button type="button" className="btn btn-secondary w-50" onClick={() => setEditId(null)}>Cancel</button>
                          </div>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{p.title}</td>
                      <td>{p.type.charAt(0).toUpperCase() + p.type.slice(1)}</td>
                      <td style={{maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.content}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-link btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
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

export default Content;
