import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchAdminJson, toArray } from "./adminApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", parent: "" });
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", parent: "" });

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson("/api/categories", { signal: controller.signal })
      .then(data => {
        setCategories(toArray(data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load categories");
        setLoading(false);
      });

    return () => controller.abort();
  }, [success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError(null);
    fetchAdminJson("/api/categories", {
      method: "POST",
      body: JSON.stringify(form)
    })
      .then(data => {
        if (data && data._id) {
          setSuccess("Category saved successfully.");
          setForm({ name: "", parent: "" });
        } else {
          setError("Failed to save category.");
        }
      })
      .catch((err) => setError(err.message || "Failed to save category."));
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditForm({ name: cat.name, parent: cat.parent || "" });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setError(null);
    fetchAdminJson(`/api/categories/${editId}`, {
      method: "PUT",
      body: JSON.stringify(editForm)
    })
      .then(data => {
        if (data && data._id) {
          setSuccess("Category updated.");
          setEditId(null);
        } else {
          setError("Failed to update category.");
        }
      })
      .catch((err) => setError(err.message || "Failed to update category."));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category?")) return;
    setError(null);
    fetchAdminJson(`/api/categories/${id}`, { method: "DELETE" })
      .then(() => setSuccess("Category deleted."))
      .catch((err) => setError(err.message || "Failed to delete category."));
  };

  // Group subcategories under their parent
  const grouped = categories.reduce((acc, cat) => {
    if (!cat.parent) acc[cat._id] = { ...cat, subs: [] };
    return acc;
  }, {});
  categories.forEach(cat => {
    if (cat.parent && grouped[cat.parent]) grouped[cat.parent].subs.push(cat);
  });

  // Drag-and-drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(Object.values(grouped));
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    // Optionally, send new order to backend here
    setCategories([
      ...items,
      ...categories.filter(c => c.parent) // keep subcategories as is
    ]);
    // Example: fetch('/api/categories/reorder', { method: 'POST', body: ... })
  };

  return (
    <div>
      <h2 className="mb-4">Categories Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Category Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Parent Category (optional)</label>
            <select className="form-select" name="parent" value={form.parent} onChange={handleChange}>
              <option value="">None (Top-level)</option>
              {categories.filter(c => !c.parent).map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories-droppable">
            {(provided) => (
              <table className="table table-striped table-hover align-middle" ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Subcategories</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4">Loading...</td></tr>
                  ) : Object.values(grouped).length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No categories found.</td></tr>
                  ) : (
                    Object.values(grouped).map((cat, idx) => (
                      <Draggable key={cat._id} draggableId={cat._id} index={idx}>
                        {(provided) => (
                          <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <td>
                              {editId === cat._id ? (
                                <form className="d-flex" onSubmit={handleEditSubmit}>
                                  <input type="text" className="form-control me-2" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
                                  <select className="form-select me-2" value={editForm.parent} onChange={e => setEditForm(f => ({ ...f, parent: e.target.value }))}>
                                    <option value="">None (Top-level)</option>
                                    {categories.filter(c => !c.parent && c._id !== cat._id).map(c => (
                                      <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                  </select>
                                  <button type="submit" className="btn btn-success btn-sm me-2">Save</button>
                                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                                </form>
                              ) : (
                                <>
                                  {cat.name}
                                  <button className="btn btn-link btn-sm ms-2" onClick={() => handleEdit(cat)}>Edit</button>
                                </>
                              )}
                            </td>
                            <td>
                              {cat.subs.length === 0 ? (
                                <span className="text-muted">None</span>
                              ) : (
                                <ul className="mb-0 ps-3">
                                  {cat.subs.map(sub => (
                                    <li key={sub._id}>{sub.name}</li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Categories;
