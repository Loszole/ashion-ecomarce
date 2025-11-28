import React, { useState, useEffect } from "react";

const Settings = () => {
  const [general, setGeneral] = useState({ siteName: "", siteEmail: "" });
  const [payment, setPayment] = useState({ provider: "paypal", apiKey: "" });
  const [shipping, setShipping] = useState({ method: "standard", cost: 0 });
  const [seo, setSeo] = useState({ metaTitle: "", metaDescription: "" });
  const [email, setEmail] = useState({ smtpHost: "", smtpPort: "", smtpUser: "", smtpPass: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings/general").then(res => res.json()),
      fetch("/api/settings/payment").then(res => res.json()),
      fetch("/api/settings/shipping").then(res => res.json()),
      fetch("/api/settings/seo").then(res => res.json()),
      fetch("/api/settings/email").then(res => res.json())
    ]).then(([g, p, s, seoData, emailData]) => {
      setGeneral(g || {});
      setPayment(p || {});
      setShipping(s || {});
      setSeo(seoData || {});
      setEmail(emailData || {});
    }).catch(() => setError("Failed to load settings."));
  }, []);

  const handleGeneral = e => setGeneral({ ...general, [e.target.name]: e.target.value });
  const handlePayment = e => setPayment({ ...payment, [e.target.name]: e.target.value });
  const handleShipping = e => setShipping({ ...shipping, [e.target.name]: e.target.value });
  const handleSeo = e => setSeo({ ...seo, [e.target.name]: e.target.value });
  const handleEmail = e => setEmail({ ...email, [e.target.name]: e.target.value });

  const handleSubmit = (e, type) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    let data;
    if (type === "general") data = general;
    else if (type === "payment") data = payment;
    else if (type === "shipping") data = shipping;
    else if (type === "seo") data = seo;
    else if (type === "email") data = email;
    fetch(`/api/settings/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) setSuccess("Settings saved.");
        else setError("Failed to save settings.");
      })
      .catch(() => setError("Failed to save settings."));
  };

  return (
    <div>
      <h2 className="mb-4">Settings</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* General Site Settings */}
      <div className="card p-3 mb-4">
        <h5>General Site Settings</h5>
        <form className="row g-2" onSubmit={e => handleSubmit(e, "general")}> 
          <div className="col-md-4">
            <label className="form-label">Site Name</label>
            <input type="text" className="form-control" name="siteName" value={general.siteName || ""} onChange={handleGeneral} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Site Email</label>
            <input type="email" className="form-control" name="siteEmail" value={general.siteEmail || ""} onChange={handleGeneral} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>

      {/* Payment Settings */}
      <div className="card p-3 mb-4">
        <h5>Payment Settings</h5>
        <form className="row g-2" onSubmit={e => handleSubmit(e, "payment")}> 
          <div className="col-md-4">
            <label className="form-label">Provider</label>
            <select className="form-select" name="provider" value={payment.provider || "paypal"} onChange={handlePayment} required>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">API Key</label>
            <input type="text" className="form-control" name="apiKey" value={payment.apiKey || ""} onChange={handlePayment} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>

      {/* Shipping Settings */}
      <div className="card p-3 mb-4">
        <h5>Shipping Settings</h5>
        <form className="row g-2" onSubmit={e => handleSubmit(e, "shipping")}> 
          <div className="col-md-4">
            <label className="form-label">Method</label>
            <select className="form-select" name="method" value={shipping.method || "standard"} onChange={handleShipping} required>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="pickup">Store Pickup</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Cost</label>
            <input type="number" className="form-control" name="cost" min="0" value={shipping.cost || 0} onChange={handleShipping} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>

      {/* SEO Settings */}
      <div className="card p-3 mb-4">
        <h5>SEO Settings</h5>
        <form className="row g-2" onSubmit={e => handleSubmit(e, "seo")}> 
          <div className="col-md-4">
            <label className="form-label">Meta Title</label>
            <input type="text" className="form-control" name="metaTitle" value={seo.metaTitle || ""} onChange={handleSeo} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Meta Description</label>
            <input type="text" className="form-control" name="metaDescription" value={seo.metaDescription || ""} onChange={handleSeo} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>

      {/* Email Settings */}
      <div className="card p-3 mb-4">
        <h5>Email Settings</h5>
        <form className="row g-2" onSubmit={e => handleSubmit(e, "email")}> 
          <div className="col-md-3">
            <label className="form-label">SMTP Host</label>
            <input type="text" className="form-control" name="smtpHost" value={email.smtpHost || ""} onChange={handleEmail} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">SMTP Port</label>
            <input type="number" className="form-control" name="smtpPort" value={email.smtpPort || ""} onChange={handleEmail} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">SMTP User</label>
            <input type="text" className="form-control" name="smtpUser" value={email.smtpUser || ""} onChange={handleEmail} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">SMTP Pass</label>
            <input type="password" className="form-control" name="smtpPass" value={email.smtpPass || ""} onChange={handleEmail} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
