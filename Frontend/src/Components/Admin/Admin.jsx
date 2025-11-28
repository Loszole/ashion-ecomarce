import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Categories from "./Categories";
import Users from "./Users";
import Reports from "./Reports";
import Settings from "./Settings";
import Inventory from "./Inventory";
import Reviews from "./Reviews";
import Discounts from "./Discounts";
import Content from "./Content";
import Appearance from "./Appearance";
import HomepageEditor from "./HomepageEditor";
import Messages from "./Messages";
import AuditLogs from "./AuditLogs";
import "./Admin.css";

const Admin = () => {
  return (
    <Router>
      <div className="admin-dashboard d-flex">
        {/* Sidebar */}
        <aside className="admin-sidebar bg-white shadow-sm">
          <div className="sidebar-header p-3 mb-4 border-bottom">
            <h2 className="text-primary">E-Com Admin</h2>
          </div>
          <nav className="nav flex-column">
            <NavLink className="nav-link" to="/admin">Dashboard</NavLink>
            <NavLink className="nav-link" to="/admin/orders">Orders</NavLink>
            <NavLink className="nav-link" to="/admin/products">Products</NavLink>
            <NavLink className="nav-link" to="/admin/categories">Categories</NavLink>
            <NavLink className="nav-link" to="/admin/users">Users</NavLink>
            <NavLink className="nav-link" to="/admin/inventory">Inventory</NavLink>
            <NavLink className="nav-link" to="/admin/reviews">Reviews</NavLink>
            <NavLink className="nav-link" to="/admin/discounts">Discounts</NavLink>
            <NavLink className="nav-link" to="/admin/content">Content</NavLink>
            <NavLink className="nav-link" to="/admin/appearance">Appearance</NavLink>
            <NavLink className="nav-link" to="/admin/homepage">Homepage Editor</NavLink>
            <NavLink className="nav-link" to="/admin/settings">Settings</NavLink>
            <NavLink className="nav-link" to="/admin/reports">Reports</NavLink>
            <NavLink className="nav-link" to="/admin/messages">Messages</NavLink>
            <NavLink className="nav-link" to="/admin/audit-logs">Audit Logs</NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main flex-grow-1 p-4 bg-light">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/reviews" element={<Reviews />} />
            <Route path="/admin/discounts" element={<Discounts />} />
            <Route path="/admin/content" element={<Content />} />
            <Route path="/admin/appearance" element={<Appearance />} />
            <Route path="/admin/homepage" element={<HomepageEditor />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/messages" element={<Messages />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default Admin;
