import React, { useState } from "react";
import { fetchAdminJson } from "./adminApi";

const Appearance = () => {
  const [banner, setBanner] = useState(null);
  const [color, setColor] = useState({ primary: "#007bff", secondary: "#6c757d" });
  const [layout, setLayout] = useState({ sections: ["Hero", "Featured Products", "Newsletter"] });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleBanner = e => setBanner(e.target.files[0]);
  const handleColor = e => setColor({ ...color, [e.target.name]: e.target.value });
  const handleLayoutChange = (idx, value) => {
    const updated = [...layout.sections];
    updated[idx] = value;
    setLayout({ sections: updated });
  };

  const handleBannerSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!banner) return setError("Please select a banner image.");
    const formData = new FormData();
    formData.append("banner", banner);
    fetchAdminJson("/api/appearance/banner", {
      method: "POST",
      body: formData
    })
      .then(data => {
        if (data && data.success) setSuccess("Banner uploaded.");
        else setError("Failed to upload banner.");
      })
      .catch((err) => setError(err.message || "Failed to upload banner."));
  };

  const handleColorSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    fetchAdminJson("/api/appearance/colors", {
      method: "POST",
      body: JSON.stringify(color)
    })
      .then(data => {
        if (data && data.success) setSuccess("Colors updated.");
        else setError("Failed to update colors.");
      })
      .catch((err) => setError(err.message || "Failed to update colors."));
  };

  const handleLayoutSubmit = e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    fetchAdminJson("/api/homepage", {
      method: "PUT",
      body: JSON.stringify({ layout })
    })
      .then(data => {
        if (data && data._id) setSuccess("Homepage layout updated.");
        else setError("Failed to update layout.");
      })
      .catch((err) => setError(err.message || "Failed to update layout."));
  };

  return (
    <div>
      <h2 className="mb-4">Appearance / Theme Management</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Banner Upload */}
      <div className="card p-3 mb-4">
        <h5>Change Banner</h5>
        <form className="row g-2 align-items-end" onSubmit={handleBannerSubmit}>
          <div className="col-md-6">
            <input type="file" className="form-control" accept="image/*" onChange={handleBanner} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Upload</button>
          </div>
        </form>
      </div>

      {/* Color Picker */}
      <div className="card p-3 mb-4">
        <h5>Theme Colors</h5>
        <form className="row g-2 align-items-end" onSubmit={handleColorSubmit}>
          <div className="col-md-3">
            <label className="form-label">Primary Color</label>
            <input type="color" className="form-control form-control-color" name="primary" value={color.primary} onChange={handleColor} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Secondary Color</label>
            <input type="color" className="form-control form-control-color" name="secondary" value={color.secondary} onChange={handleColor} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>

      {/* Homepage Layout */}
      <div className="card p-3 mb-4">
        <h5>Homepage Layout Sections</h5>
        <form className="row g-2 align-items-end" onSubmit={handleLayoutSubmit}>
          {layout.sections.map((section, idx) => (
            <div className="col-md-3" key={idx}>
              <label className="form-label">Section {idx + 1}</label>
              <input type="text" className="form-control" value={section} onChange={e => handleLayoutChange(idx, e.target.value)} />
            </div>
          ))}
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appearance;
