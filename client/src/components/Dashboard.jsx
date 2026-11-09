import { useEffect, useState, useCallback } from "react";
import { api } from "../api.js";
import TaskForm from "./TaskForm.jsx";
import TaskItem from "./TaskItem.jsx";

export default function Dashboard({ onUnauthorized }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ todo: 0, "in-progress": 0, done: 0, total: 0 });
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", sort: "newest" });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) return onUnauthorized();
      setError(err.message);
    },
    [onUnauthorized]
  );

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.getTasks(filters), api.getStats()]);
      setTasks(list);
      setStats(s);
      setError("");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [filters, handleError]);

  // Small debounce so we don't hit the API on every keystroke in search
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const setFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const save = async (data) => {
    try {
      if (editing) {
        await api.updateTask(editing._id, data);
        setEditing(null);
      } else {
        await api.createTask(data);
      }
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const changeStatus = async (task, status) => {
    try {
      await api.updateTask(task._id, { status });
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const remove = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.deleteTask(task._id);
      if (editing?._id === task._id) setEditing(null);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="dashboard">
      <section className="stats">
        <div className="stat"><b>{stats.total}</b><span>Total</span></div>
        <div className="stat"><b>{stats.todo}</b><span>To do</span></div>
        <div className="stat"><b>{stats["in-progress"]}</b><span>In progress</span></div>
        <div className="stat"><b>{stats.done}</b><span>Done</span></div>
      </section>

      <TaskForm task={editing} onSave={save} onCancel={() => setEditing(null)} />

      <section className="card filters">
        <input name="search" placeholder="Search tasks..." value={filters.search} onChange={setFilter} />
        <select name="status" value={filters.status} onChange={setFilter}>
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <select name="priority" value={filters.priority} onChange={setFilter}>
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select name="sort" value={filters.sort} onChange={setFilter}>
          <option value="newest">Newest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </section>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="muted center">No tasks found. Add your first one above.</p>
      ) : (
        tasks.map((t) => (
          <TaskItem key={t._id} task={t} onStatus={changeStatus} onEdit={setEditing} onDelete={remove} />
        ))
      )}
    </div>
  );
}
