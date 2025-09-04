const API_URL = import.meta.env.VITE_API_URL;

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Login failed");
  if (data?.token) localStorage.setItem("TOKEN", data.token);
  if (data?.refreshToken) localStorage.setItem("REFRESH_TOKEN", data.refreshToken);
  return data?.token;
}

export function getToken() {
  return localStorage.getItem("TOKEN");
}
