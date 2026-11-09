const STATUS_LABEL = { todo: "To do", "in-progress": "In progress", done: "Done" };

export default function TaskItem({ task, onStatus, onEdit, onDelete }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && task.status !== "done" && due < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className={`card task ${task.status === "done" ? "is-done" : ""}`}>
      <div className="task-main">
        <div className="task-title">
          <strong>{task.title}</strong>
          <span className={`badge p-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="muted">{task.description}</p>}
        {due && (
          <small className={overdue ? "overdue" : "muted"}>
            Due {due.toLocaleDateString()} {overdue && "(overdue)"}
          </small>
        )}
      </div>
      <div className="task-actions">
        <select value={task.status} onChange={(e) => onStatus(task, e.target.value)} aria-label="Status">
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button className="btn btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  );
}
