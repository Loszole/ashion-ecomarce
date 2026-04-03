import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [addAmount, setAddAmount] = useState(0);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson("/api/products", { signal: controller.signal })
      .then(data => {
        setProducts(toArray(data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load inventory");
        setLoading(false);
      });

    return () => controller.abort();
  }, [success]);

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!selectedProduct || addAmount <= 0) return;
    setSuccess("");
    setError(null);
    const product = products.find(p => p._id === selectedProduct);
    const currentStock = product?.stock || 0;
    fetchAdminJson(`/api/products/${selectedProduct}`, {
      method: "PUT",
      body: JSON.stringify({ stock: currentStock + addAmount })
    })
      .then(data => {
        if (data && data._id) {
          setSuccess("Inventory updated successfully.");
          setAddAmount(0);
          setSelectedProduct("");
        } else {
          setError("Failed to update inventory.");
        }
      })
      .catch((err) => setError(err.message || "Failed to update inventory."));
  };

  return (
    <div>
      <h2 className="mb-4">Inventory / Stock Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <form className="row g-2 align-items-end" onSubmit={handleAddInventory}>
          <div className="col-md-5">
            <label className="form-label">Select Product</label>
            <select className="form-select" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
              <option value="">Choose...</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Add Stock</label>
            <input type="number" className="form-control" min="1" value={addAmount} onChange={e => setAddAmount(Number(e.target.value))} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Available</th>
              <th>Price</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No products found.</td></tr>
            ) : (
              products.map((product, idx) => (
                <tr key={product._id || idx}>
                  <td>{product.name}</td>
                  <td>{product.category || "-"}</td>
                  <td>{product.stock}</td>
                  <td>${Number(product.price || 0).toLocaleString()}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
