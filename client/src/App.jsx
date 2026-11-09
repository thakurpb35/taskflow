import { useState } from "react";
import { getToken, getUser, clearSession } from "./api.js";
import Auth from "./components/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(getToken() ? getUser() : null);

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>TaskFlow</h1>
        {user && (
          <div className="topbar-right">
            <span>Hi, {user.name}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </header>
      <main>{user ? <Dashboard onUnauthorized={logout} /> : <Auth onAuth={setUser} />}</main>
    </div>
  );
}
