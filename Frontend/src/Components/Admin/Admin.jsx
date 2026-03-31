import React, { useState } from "react";
import { Switch, Route, NavLink, useRouteMatch, Link, useLocation } from "react-router-dom";
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
import "./adminTheme.css";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", path: "", icon: "ti-panel", exact: true },
  { label: "Orders", path: "orders", icon: "ti-shopping-cart" },
  { label: "Products", path: "products", icon: "ti-package" },
  { label: "Categories", path: "categories", icon: "ti-view-grid" },
  { label: "Users", path: "users", icon: "ti-user" },
  { label: "Inventory", path: "inventory", icon: "ti-archive" },
  { label: "Reviews", path: "reviews", icon: "ti-star" },
  { label: "Discounts", path: "discounts", icon: "ti-tag" },
  { label: "Content", path: "content", icon: "ti-write" },
  { label: "Appearance", path: "appearance", icon: "ti-palette" },
  { label: "Homepage Editor", path: "homepage", icon: "ti-layout" },
  { label: "Settings", path: "settings", icon: "ti-settings" },
  { label: "Reports", path: "reports", icon: "ti-bar-chart" },
  { label: "Messages", path: "messages", icon: "ti-email" },
  { label: "Audit Logs", path: "audit-logs", icon: "ti-agenda" }
];

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getActiveItem = (pathname, baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return ADMIN_NAV_ITEMS.find((item) => {
    const itemPath = item.path ? `${normalizedBase}/${item.path}` : normalizedBase;
    if (!item.path) {
      return pathname === itemPath;
    }

    return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
  }) || ADMIN_NAV_ITEMS[0];
};

const Admin = () => {
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = getCurrentUser();
  const activeItem = getActiveItem(location.pathname, url);
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  return (
    <div className={`paper-admin ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="paper-admin-shell">
        <aside className="paper-admin-sidebar" aria-label="Admin navigation">
          <div className="paper-admin-sidebar-inner">
            <div className="paper-admin-brand-block">
              <div className="paper-admin-brand-mark">A</div>
              <div>
                <p className="paper-admin-eyebrow">Ashion Commerce</p>
                <h2>Admin</h2>
              </div>
            </div>

            <div className="paper-admin-user-card">
              <div className="paper-admin-user-avatar">
                {(currentUser?.name || currentUser?.email || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{currentUser?.name || "Admin User"}</strong>
                <span>{currentUser?.role || "Administrator"}</span>
              </div>
            </div>

            <nav className="paper-admin-nav">
              {ADMIN_NAV_ITEMS.map((item) => {
                const target = item.path ? `${url}/${item.path}` : url;

                return (
                  <NavLink
                    key={item.label}
                    exact={item.exact}
                    className="paper-admin-nav-link"
                    activeClassName="active"
                    to={target}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="paper-admin-sidebar-footer">
              <Link className="paper-admin-store-link" to="/">
                <i className="ti-arrow-left"></i>
                <span>Back to Storefront</span>
              </Link>
            </div>
          </div>
        </aside>

        <button
          type="button"
          className="paper-admin-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="paper-admin-main-panel">
          <header className="paper-admin-topbar">
            <div className="paper-admin-topbar-left">
              <button
                type="button"
                className="paper-admin-menu-toggle"
                aria-label="Toggle navigation"
                onClick={() => setSidebarOpen((open) => !open)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div>
                <p className="paper-admin-eyebrow">Administration</p>
                <h1>{activeItem.label}</h1>
              </div>
            </div>
            <div className="paper-admin-topbar-right">
              <div className="paper-admin-date-chip">
                <i className="ti-calendar"></i>
                <span>{currentDate}</span>
              </div>
              <Link className="paper-admin-ghost-link" to="/">
                View store
              </Link>
            </div>
          </header>

          <section className="card paper-admin-hero-card">
            <div className="content paper-admin-hero-content">
              <div>
                <p className="paper-admin-eyebrow">Admin Dashboard</p>
                <h2>{activeItem.label}</h2>
                <p className="paper-admin-hero-text">
                  Manage products, customers, content, and storefront settings from a single themed control room.
                </p>
              </div>
              <div className="paper-admin-hero-metrics">
                <div>
                  <strong>{ADMIN_NAV_ITEMS.length}</strong>
                  <span>Sections</span>
                </div>
                <div>
                  <strong>{currentUser?.role || "Admin"}</strong>
                  <span>Access level</span>
                </div>
                <div>
                  <strong>Live</strong>
                  <span>Environment</span>
                </div>
              </div>
            </div>
          </section>

          <main className="paper-admin-content">
            <Switch>
              <Route exact path={path} component={Dashboard} />
              <Route path={`${path}/orders`} component={Orders} />
              <Route path={`${path}/products`} component={Products} />
              <Route path={`${path}/categories`} component={Categories} />
              <Route path={`${path}/users`} component={Users} />
              <Route path={`${path}/inventory`} component={Inventory} />
              <Route path={`${path}/reviews`} component={Reviews} />
              <Route path={`${path}/discounts`} component={Discounts} />
              <Route path={`${path}/content`} component={Content} />
              <Route path={`${path}/appearance`} component={Appearance} />
              <Route path={`${path}/homepage`} component={HomepageEditor} />
              <Route path={`${path}/settings`} component={Settings} />
              <Route path={`${path}/reports`} component={Reports} />
              <Route path={`${path}/messages`} component={Messages} />
              <Route path={`${path}/audit-logs`} component={AuditLogs} />
            </Switch>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
