import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

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
    Promise.all([
      fetch("/api/admin/summary").then(res => res.json()),
      fetch("/api/admin/traffic").then(res => res.json()),
      fetch("/api/orders?limit=5").then(res => res.json()),
      fetch("/api/audit-logs?limit=5").then(res => res.json())
    ])
      .then(([summary, traffic, ordersData, activityData]) => {
        setStats(summary);
        setAreaData(traffic.area || []);
        setPieData(traffic.pie || []);
        setLineData(traffic.line || []);
        setOrders(ordersData);
        setActivity(activityData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3 mb-2">
            <div className="mb-2"><i className="bi bi-cash-coin fs-2 text-success"></i></div>
            <div className="fw-bold">${stats.revenue?.toLocaleString() || 0}</div>
            <div className="text-muted">Revenue</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 mb-2">
            <div className="mb-2"><i className="bi bi-cart fs-2 text-primary"></i></div>
            <div className="fw-bold">{stats.sales?.toLocaleString() || 0}</div>
            <div className="text-muted">Sales</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 mb-2">
            <div className="mb-2"><i className="bi bi-file-earmark fs-2 text-info"></i></div>
            <div className="fw-bold">{stats.templates?.toLocaleString() || 0}</div>
            <div className="text-muted">Templates</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 mb-2">
            <div className="mb-2"><i className="bi bi-people fs-2 text-warning"></i></div>
            <div className="fw-bold">{stats.clients?.toLocaleString() || 0}</div>
            <div className="text-muted">Clients</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Traffic</h5>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card p-3 mb-3">
            <h6>Visits</h6>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-3 mb-3">
            <h6>August 2018</h6>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Recent Orders</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No recent orders.</td></tr>
                  ) : (
                    orders.map((order, idx) => (
                      <tr key={order._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{order._id}</td>
                        <td>{order.user?.name || "-"}</td>
                        <td>
                          <ul className="mb-0 ps-3">
                            {order.products.map((item, i) => (
                              <li key={i}>{item.product?.name || "-"} <span className="text-muted">x{item.quantity}</span></li>
                            ))}
                          </ul>
                        </td>
                        <td>{order.products.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td>
                          <span className={`badge bg-${order.status === "pending" ? "warning text-dark" : order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "info"}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card p-3 mb-3">
            <h6>Recent Activity</h6>
            <ul className="list-group mb-2">
              {activity.length === 0 ? (
                <li className="list-group-item text-center">No recent activity.</li>
              ) : (
                activity.map((log, idx) => (
                  <li className="list-group-item" key={log._id || idx}>
                    <span className="fw-bold">{log.user?.name || "-"}</span> {log.action.replace(/_/g, ' ')}
                    <span className="text-muted float-end">{new Date(log.createdAt).toLocaleString()}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="card p-3">
            <h6>Live Chat</h6>
            <div className="chat-placeholder" style={{height: 100, background: '#f5f5f5', borderRadius: 8}}>
              <div className="text-center text-muted pt-4">[Live Chat Widget]</div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </>
  );
};

export default Dashboard;
