import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

// Prevent CRA overlay from treating the known ResizeObserver browser warning as a hard runtime error.
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const message = event?.message || "";
    if (
      message.includes("ResizeObserver loop completed with undelivered notifications") ||
      message.includes("ResizeObserver loop limit exceeded")
    ) {
      event.stopImmediatePropagation();
    }
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
