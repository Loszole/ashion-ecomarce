import React, { useEffect, useState } from "react";
import { fetchAdminJson, toArray } from "./adminApi";

const Messages = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminJson("/api/messages", { signal: controller.signal })
      .then(data => {
        setTickets(toArray(data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load messages");
        setLoading(false);
      });

    return () => controller.abort();
  }, [success]);

  const handleSelect = (ticket) => {
    setSelected(ticket);
    setReply("");
  };

  const handleReply = e => setReply(e.target.value);

  const handleSendReply = e => {
    e.preventDefault();
    const controller = new AbortController();
    fetchAdminJson(`/api/messages/${selected._id}/reply`, {
      method: "POST",
      body: JSON.stringify({ reply }),
      signal: controller.signal
    })
      .then(data => {
        if (data && data.success) {
          setSuccess("Reply sent.");
          setReply("");
          setSelected(null);
          // Refresh the ticket list
          fetchAdminJson("/api/messages", { signal: controller.signal })
            .then(updatedData => {
              setTickets(toArray(updatedData));
            })
            .catch(err => {
              if (err.name !== "AbortError") console.error("Failed to refresh tickets", err);
            });
        } else {
          setError("Failed to send reply.");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to send reply.");
      });
  };

  const handleClose = id => {
    if (!window.confirm("Close this ticket?")) return;
    fetchAdminJson(`/api/messages/${id}/close`, { method: "POST" })
      .then(data => {
        if (data && data.success) setSuccess("Ticket closed.");
        else setError("Failed to close ticket.");
      })
      .catch((err) => setError(err.message || "Failed to close ticket."));
  };

  return (
    <div>
      <h2>Messages/Contact Requests</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-5">
          <div className="card p-3 mb-3">
            <h5>Tickets</h5>
            {loading ? <div>Loading...</div> : (
              <ul className="list-group">
                {tickets.length === 0 ? (
                  <li className="list-group-item text-center">No tickets found.</li>
                ) : (
                  tickets.map(t => (
                    <li key={t._id} className={`list-group-item d-flex justify-content-between align-items-center${selected && selected._id === t._id ? " active" : ""}`} onClick={() => handleSelect(t)} style={{ cursor: "pointer" }}>
                      <span>
                        <b>{t.subject || "No subject"}</b> <span className="text-muted">({t.status || "open"})</span>
                        <br />
                        <small>{t.name || "-"} &lt;{t.email || "-"}&gt;</small>
                      </span>
                      <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
        <div className="col-md-7">
          {selected && (
            <div className="card p-3">
              <h5>{selected.subject}</h5>
              <div className="mb-2"><b>From:</b> {selected.name} &lt;{selected.email}&gt;</div>
              <div className="mb-2"><b>Status:</b> {selected.status}</div>
              <div className="mb-2"><b>Message:</b><br />{selected.message}</div>
              {selected.replies && selected.replies.length > 0 && (
                <div className="mb-2">
                  <b>Replies:</b>
                  <ul className="list-group mb-2">
                    {toArray(selected.replies).map((r, i) => (
                      <li key={i} className="list-group-item">
                        <b>Admin:</b> {r.reply}<br />
                        <small>{r.date ? new Date(r.date).toLocaleString() : "-"}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.status !== "closed" && (
                <form onSubmit={handleSendReply} className="mb-2">
                  <textarea className="form-control mb-2" rows={3} value={reply} onChange={handleReply} required placeholder="Type your reply..." />
                  <button type="submit" className="btn btn-success me-2">Send Reply</button>
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setSelected(null)}>Back</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleClose(selected._id)}>Close Ticket</button>
                </form>
              )}
              {selected.status === "closed" && (
                <div className="alert alert-info">This ticket is closed.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
