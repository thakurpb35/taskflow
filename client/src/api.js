const BASE = import.meta.env.VITE_API_URL || "/api";

export const getToken = () => localStorage.getItem("tf_token");
export const setSession = (token, user) => {
  localStorage.setItem("tf_token", token);
  localStorage.setItem("tf_user", JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem("tf_token");
  localStorage.removeItem("tf_user");
};
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("tf_user"));
  } catch {
    return null;
  }
};

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getTasks: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/tasks${qs ? `?${qs}` : ""}`);
  },
  getStats: () => request("/tasks/stats"),
  createTask: (body) => request("/tasks", { method: "POST", body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
