const API_URL = import.meta.env.VITE_API_URL;

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Login failed");
  if (data?.token) localStorage.setItem("TOKEN", data.token);
  return data?.token;
}

export function getToken() {
  return localStorage.getItem("TOKEN");
}
