import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Banner" },
  { id: "featured", name: "Featured Products" },
  { id: "newsletter", name: "Newsletter Signup" },
  { id: "categories", name: "Shop by Category" },
  { id: "testimonials", name: "Testimonials" },
  { id: "footer", name: "Footer" }
];

const HomepageEditor = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [newSection, setNewSection] = useState("");

  useEffect(() => {
    fetch("/api/homepage")
      .then(res => res.json())
      .then(data => {
        setSections(data?.layout?.sections || DEFAULT_SECTIONS);
        setLoading(false);
      })
      .catch(() => {
        setSections(DEFAULT_SECTIONS);
        setLoading(false);
      });
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setSections(items);
  };

  const handleSave = () => {
    setSuccess("");
    setError(null);
    fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout: { sections } })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) setSuccess("Homepage layout saved.");
        else setError("Failed to save layout.");
      })
      .catch(() => setError("Failed to save layout."));
  };

  const handleEdit = (idx, value) => {
    setSections(sections.map((s, i) => i === idx ? { ...s, name: value } : s));
  };

  const handleRemove = idx => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    if (!newSection.trim()) return;
    setSections([...sections, { id: `custom_${Date.now()}`, name: newSection }]);
    setNewSection("");
  };

  return (
    <div>
      <h2>Homepage Customization</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections-droppable">
              {(provided) => (
                <ul className="list-group mb-4" ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.map((section, idx) => (
                    <Draggable key={section.id} draggableId={section.id} index={idx}>
                      {(provided) => (
                        <li className="list-group-item d-flex align-items-center gap-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <span className="me-2" style={{ cursor: "grab" }}>☰</span>
                          <input type="text" className="form-control" value={section.name} onChange={e => handleEdit(idx, e.target.value)} />
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemove(idx)}>Remove</button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <div className="mb-3 d-flex gap-2">
            <input className="form-control" placeholder="Add new section..." value={newSection} onChange={e => setNewSection(e.target.value)} />
            <button className="btn btn-primary" onClick={handleAdd}>Add Section</button>
          </div>
          <button className="btn btn-success" onClick={handleSave}>Save Layout</button>
        </>
      )}
    </div>
  );
};

export default HomepageEditor;
