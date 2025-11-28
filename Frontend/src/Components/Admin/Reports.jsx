import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Reports = () => {
  const [filter, setFilter] = useState({ period: "month", category: "all" });
  const [sales, setSales] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/reports/sales?period=${filter.period}&category=${filter.category}`).then(res => res.json()),
      fetch(`/api/reports/traffic?period=${filter.period}`).then(res => res.json()),
      fetch(`/api/reports/products?period=${filter.period}&category=${filter.category}`).then(res => res.json()),
      fetch(`/api/categories`).then(res => res.json())
    ])
      .then(([salesData, trafficData, productData, cats]) => {
        setSales(salesData || []);
        setTraffic(trafficData || []);
        setProducts(productData || []);
        setCategories(cats || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load reports");
        setLoading(false);
      });
  }, [filter]);

  const handleFilter = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("E-Commerce Analytics Report", 10, 15);
    doc.setFontSize(12);
    doc.text(`Period: ${filter.period}`, 10, 25);
    doc.text(`Category: ${filter.category === "all" ? "All" : categories.find(c => c._id === filter.category)?.name || ""}`, 10, 32);
    let y = 40;
    doc.text("Sales:", 10, y);
    sales.forEach((s, i) => {
      doc.text(`${s.label}: $${s.total}`, 20, y + 7 + i * 7);
    });
    y += 7 * (sales.length + 1);
    doc.text("Traffic:", 10, y);
    traffic.forEach((t, i) => {
      doc.text(`${t.label}: ${t.visits} visits`, 20, y + 7 + i * 7);
    });
    y += 7 * (traffic.length + 1);
    doc.text("Top Products:", 10, y);
    products.forEach((p, i) => {
      doc.text(`${p.name}: ${p.sold} sold`, 20, y + 7 + i * 7);
    });
    doc.save(`report_${filter.period}_${filter.category}.pdf`);
  };

  const handleDownloadCSV = () => {
    let csv = `Section,Label,Value\n`;
    sales.forEach(s => { csv += `Sales,${s.label},${s.total}\n`; });
    traffic.forEach(t => { csv += `Traffic,${t.label},${t.visits}\n`; });
    products.forEach(p => { csv += `Product,${p.name},${p.sold}\n`; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `report_${filter.period}_${filter.category}.csv`);
  };

  return (
    <div>
      <h2>Reports/Analytics</h2>
      <div className="mb-3 d-flex gap-3 align-items-center">
        <label>Period:</label>
        <select className="form-select w-auto" name="period" value={filter.period} onChange={handleFilter}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <label>Category:</label>
        <select className="form-select w-auto" name="category" value={filter.category} onChange={handleFilter}>
          <option value="all">All</option>
          {categories.filter(c => !c.parent).map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <button className="btn btn-outline-primary" onClick={handleDownloadPDF}>Download PDF</button>
        <button className="btn btn-outline-success" onClick={handleDownloadCSV}>Download CSV</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card p-3">
                <h5>Sales</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={sales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={sales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={sales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3">
                <h5>Traffic</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={traffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={traffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#00C49F" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card p-3">
                <h5>Top Products</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={products} dataKey="sold" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {products.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
