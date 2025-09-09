import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "auth_logout" });
    navigate("/login");
  };

  // build a display name
  const displayName =
    store.auth.user?.first_name || store.auth.user?.last_name
      ? `${store.auth.user.first_name || ""} ${store.auth.user.last_name || ""}`.trim()
      : store.auth.user?.email;

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand mb-0 h1">
          React Boilerplate
        </Link>

        {store.auth.token ? (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">Welcome, {displayName}</span>
            <Link to="/private">
              <button className="btn btn-outline-primary btn-sm">Dashboard</button>
            </Link>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login">
              <button className="btn btn-primary btn-sm">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-outline-secondary btn-sm">Signup</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};