import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const [serverMsg, setServerMsg] = useState("");

  // figure out how to display user
  const displayName =
    store.auth.user?.first_name || store.auth.user?.last_name
      ? `${store.auth.user.first_name || ""} ${store.auth.user.last_name || ""}`.trim()
      : store.auth.user?.email;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // validate token with backend
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) return navigate("/login");
        const data = await res.json();
        setServerMsg(data.msg);
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  return (
    <div className="container">
      <h2 className="my-4">Private Dashboard</h2>
      <div className="alert alert-success">
        {serverMsg || "You are authenticated."}
      </div>
      <p>
        Logged in as: <strong>{displayName}</strong>
      </p>
      <p>This page validates your token on mount and will redirect if invalid.</p>
    </div>
  );
};