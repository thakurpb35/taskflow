import { useState, useEffect } from "react";

const empty = { title: "", description: "", priority: "medium", status: "todo", dueDate: "" };

// Used for both creating and editing. Pass `task` to edit.
export default function TaskForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(
      task
        ? { ...empty, ...task, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "" }
        : empty
    );
  }, [task]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
    });
    if (!task) setForm(empty);
  };

  return (
    <form className="card task-form" onSubmit={submit}>
      <h3>{task ? "Edit task" : "Add a task"}</h3>
      <input name="title" placeholder="Task title" value={form.title} onChange={change} required />
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        value={form.description}
        onChange={change}
      />
      <div className="row">
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={change}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Due date
          <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        </label>
      </div>
      <div className="row">
        <button className="btn">{task ? "Save changes" : "Add task"}</button>
        {task && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
