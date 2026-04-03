import React, { useCallback, useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", stock: "" });
  const [imageFiles, setImageFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", category: "", price: "", stock: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchProducts = useCallback((signal, curPage) => {
    setLoading(true);
    fetchAdminJson(`/api/products?page=${curPage}&limit=${limit}`, { signal })
      .then(data => {
        setProducts(toArray(data));
        setTotalPages(data.pagination?.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, [limit]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal, page);
    return () => controller.abort();
  }, [page, fetchProducts]);

  const handleAdd = e => {
    e.preventDefault();
    setError(null);
    const controller = new AbortController();

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("category", form.category);
    payload.append("price", form.price);
    payload.append("stock", form.stock);
    Array.from(imageFiles).forEach((file) => payload.append("images", file));

    fetchAdminJson("/api/products", {
      method: "POST",
      body: payload,
      signal: controller.signal
    })
      .then(() => {
        setForm({ name: "", description: "", category: "", price: "", stock: "" });
        setImageFiles([]);
        setPage(1);
        fetchProducts(controller.signal, 1);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to add product");
      });
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleEdit = id => {
    const prod = products.find(p => p._id === id);
    setEditId(id);
    setEditForm({
      name: prod.name,
      description: prod.description || "",
      category: prod.category,
      price: prod.price,
      stock: prod.stock
    });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    setError(null);
    const controller = new AbortController();
    fetchAdminJson(`/api/products/${editId}`, {
      method: "PUT",
      body: JSON.stringify(editForm),
      signal: controller.signal
    })
      .then(() => {
        setEditId(null);
        fetchProducts(controller.signal, page);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to update product");
      });
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this product?")) return;
    setError(null);
    const controller = new AbortController();
    fetchAdminJson(`/api/products/${id}`, { method: "DELETE", signal: controller.signal })
      .then(() => fetchProducts(controller.signal, page))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to delete product");
      });
  };

  return (
    <div className="card p-3">
      <h5 className="mb-3">Products</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No products found.</td></tr>
            ) : (
              products.map((prod, idx) => (
                editId === prod._id ? (
                  <tr key={prod._id}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td colSpan="4">
                      <form className="row g-2" onSubmit={handleEditSubmit}>
                        <div className="col-md-3">
                          <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div className="col-md-3">
                          <input type="text" className="form-control" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} required />
                        </div>
                        <div className="col-md-2">
                          <input type="number" className="form-control" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} required />
                        </div>
                        <div className="col-md-2">
                          <input type="number" className="form-control" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} required />
                        </div>
                        <div className="col-md-2">
                          <button type="submit" className="btn btn-success w-100">Save</button>
                        </div>
                      </form>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={prod._id}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{prod.name}</td>
                    <td>{prod.category}</td>
                    <td>${prod.price}</td>
                    <td>{prod.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(prod._id)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod._id)}>Delete</button>
                    </td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center my-3">
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
      <div className="mt-4">
        <h6>Add Product</h6>
        <form onSubmit={handleAdd}>
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div className="col-md-1">
              <input type="number" className="form-control" placeholder="Stock" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
            </div>
            <div className="col-md-2">
              <input type="file" className="form-control" accept="image/*" multiple onChange={e => setImageFiles(e.target.files || [])} />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-success w-100">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;
