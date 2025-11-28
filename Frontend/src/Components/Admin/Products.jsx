import React, { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", price: "", stock: "" });

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = e => {
    e.preventDefault();
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setForm({ name: "", category: "", price: "", stock: "" });
        fetchProducts();
      })
      .catch(() => setError("Failed to add product"));
  };

  const handleEdit = id => {
    const prod = products.find(p => p._id === id);
    setEditId(id);
    setEditForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock
    });
  };

  const handleEditSubmit = e => {
    e.preventDefault();
    fetch(`/api/products/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(() => {
        setEditId(null);
        fetchProducts();
      })
      .catch(() => setError("Failed to update product"));
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this product?")) return;
    fetch(`/api/products/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => fetchProducts())
      .catch(() => setError("Failed to delete product"));
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
                    <td>{idx + 1}</td>
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
                    <td>{idx + 1}</td>
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
      <div className="mt-4">
        <h6>Add Product</h6>
        <form onSubmit={handleAdd}>
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Stock" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
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
