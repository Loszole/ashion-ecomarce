import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const formatNumber = (value) => Number(value || 0).toLocaleString();

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, sales: 0, templates: 0, clients: 0 });
  const [areaData, setAreaData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    const authHeaders = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const fetchJson = async (url) => {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
        signal: controller.signal
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status}`);
      }
      return data;
    };

    if (!token) {
      setError("Please log in again to load admin dashboard data.");
      setLoading(false);
      return () => controller.abort();
    }

    Promise.all([
      fetchJson("/api/admin/summary"),
      fetchJson("/api/admin/traffic"),
      fetchJson("/api/orders/list?limit=5"),
      fetchJson("/api/audit-logs?limit=5")
    ])
      .then(([summary, traffic, ordersData, activityData]) => {
        const safeOrders = Array.isArray(ordersData?.data)
          ? ordersData.data
          : Array.isArray(ordersData)
            ? ordersData
            : [];

        const safeActivity = Array.isArray(activityData)
          ? activityData
          : Array.isArray(activityData?.data)
            ? activityData.data
            : [];

        setStats(summary || { revenue: 0, sales: 0, templates: 0, clients: 0 });
        setAreaData(Array.isArray(traffic?.area) ? traffic.area : []);
        setPieData(Array.isArray(traffic?.pie) ? traffic.pie : []);
        setLineData(Array.isArray(traffic?.line) ? traffic.line : []);
        setOrders(safeOrders);
        setActivity(safeActivity);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const summaryCards = [
    {
      label: "Revenue",
      value: `$${formatNumber(stats.revenue)}`,
      icon: "ti-wallet",
      iconClass: "icon-success",
      stat: "Updated from live orders"
    },
    {
      label: "Sales",
      value: formatNumber(stats.sales),
      icon: "ti-shopping-cart",
      iconClass: "icon-info",
      stat: "Completed checkouts"
    },
    {
      label: "Templates",
      value: formatNumber(stats.templates),
      icon: "ti-layout-grid2",
      iconClass: "icon-warning",
      stat: "Catalog experiences"
    },
    {
      label: "Clients",
      value: formatNumber(stats.clients),
      icon: "ti-user",
      iconClass: "icon-danger",
      stat: "Registered customers"
    }
  ];

  if (loading) {
    return (
      <div className="card">
        <div className="content">
          <div className="paper-admin-empty">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        {summaryCards.map((card) => (
          <div className="col-lg-3 col-sm-6" key={card.label}>
            <div className="card">
              <div className="content">
                <div className="row align-items-center">
                  <div className="col-4">
                    <div className={`icon-big text-center ${card.iconClass}`}>
                      <i className={card.icon}></i>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="numbers">
                      <p>{card.label}</p>
                      <strong>{card.value}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  <i className="ti-reload"></i> {card.stat}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="header">
              <h5 className="title">Traffic Overview</h5>
              <p className="card-category">Store visits across the recent reporting window.</p>
            </div>
            <div className="content">
              {areaData.length === 0 ? (
                <div className="paper-admin-empty">No traffic data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={280} debounce={120}>
                  <AreaChart data={areaData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="paperTrafficFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#68B3C8" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#68B3C8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#efe6da" />
                    <XAxis dataKey="month" stroke="#9a8f82" />
                    <YAxis stroke="#9a8f82" />
                    <Tooltip />
                    <Area type="monotone" dataKey="visits" stroke="#68B3C8" fillOpacity={1} fill="url(#paperTrafficFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="footer">
              <div className="stats">
                <i className="ti-bar-chart"></i> Daily traffic trend
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="header">
              <h5 className="title">Visit Sources</h5>
              <p className="card-category">Breakdown of active traffic channels.</p>
            </div>
            <div className="content">
              {pieData.length === 0 ? (
                <div className="paper-admin-empty">No source breakdown available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={180} debounce={120}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={56} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="card">
            <div className="header">
              <h5 className="title">Pulse</h5>
              <p className="card-category">Quick performance line for the current cycle.</p>
            </div>
            <div className="content">
              {lineData.length === 0 ? (
                <div className="paper-admin-empty">No pulse data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={100} debounce={120}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#EB5E28" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="header">
              <h5 className="title">Recent Orders</h5>
              <p className="card-category">Most recent purchase activity from your customers.</p>
            </div>
            <div className="content">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No recent orders.</td></tr>
                    ) : (
                      orders.map((order, idx) => {
                        const products = Array.isArray(order.products) ? order.products : [];
                        const badgeClass = order.status === "pending"
                          ? "warning"
                          : order.status === "delivered"
                            ? "success"
                            : order.status === "cancelled"
                              ? "danger"
                              : "info";

                        return (
                          <tr key={order._id || idx}>
                            <td>{idx + 1}</td>
                            <td>{order._id}</td>
                            <td>{order.user?.name || "-"}</td>
                            <td>
                              <ul className="mb-0 ps-3">
                                {products.map((item, i) => (
                                  <li key={i}>
                                    {item.product?.name || "-"} <span className="text-muted">x{item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>{products.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</td>
                            <td>
                              <span className={`badge bg-${badgeClass}`}>
                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="header">
              <h5 className="title">Recent Activity</h5>
              <p className="card-category">Latest actions captured in the audit trail.</p>
            </div>
            <div className="content">
              <ul className="list-group mb-0">
                {activity.length === 0 ? (
                  <li className="list-group-item text-center">No recent activity.</li>
                ) : (
                  activity.map((log, idx) => (
                    <li className="list-group-item" key={log._id || idx}>
                      <span className="fw-bold">{log.user?.name || "-"}</span> {String(log.action || "updated").replace(/_/g, " ")}
                      <span className="text-muted d-block mt-1">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Unknown date"}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="header">
              <h5 className="title">Support Queue</h5>
              <p className="card-category">Reserved space for real-time staff collaboration.</p>
            </div>
            <div className="content">
              <div className="paper-admin-empty">Live chat widget placeholder</div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </>
  );
};

export default Dashboard;
