import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "user" | "admin";
};

export function getApiUrl() {
  return import.meta.env.VITE_API_URL || "";
}

export function getToken() {
  return localStorage.getItem("cdcl_token");
}

export function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) URL'da token bormi? (Google'dan qaytishda shu yerda bo'ladi)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("cdcl_token", urlToken);
      // URL'ni tozalash — token manzil satrida qolmasin
      window.history.replaceState({}, "", window.location.pathname);
    }

    // 2) Token yo'q bo'lsa, login sahifasi
    const t = getToken();
    if (!t) {
      setLoading(false);
      return;
    }

    // 3) Token bor — kim ekanini so'raymiz
    fetch(`${getApiUrl()}/api/auth/me`, {
      headers: authHeaders(),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("no session");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("cdcl_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-fg">
        <p className="text-muted animate-pulse text-sm font-mono">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard user={user} />;
}