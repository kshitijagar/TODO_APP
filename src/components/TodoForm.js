import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form className="mb-3 d-flex gap-2" onSubmit={handleSubmit}>
      <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Todo" />
      <button className="btn btn-primary">Add</button>
    </form>
  );
}
