import { useState } from "react";
import { api, setSession } from "../api.js";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register(form);
      setSession(data.token, data.user);
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card auth-card" onSubmit={submit}>
      <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
      {error && <div className="error">{error}</div>}
      {mode === "register" && (
        <input name="name" placeholder="Full name" value={form.name} onChange={change} required />
      )}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input
        name="password"
        type="password"
        placeholder="Password (min 6 characters)"
        value={form.password}
        onChange={change}
        minLength={6}
        required
      />
      <button className="btn" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <p className="muted">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </a>
      </p>
    </form>
  );
}
