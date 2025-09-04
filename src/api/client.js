const API_URL = import.meta.env.VITE_API_URL;

function buildHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('TOKEN');
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    const errText = isJson ? JSON.stringify(await res.json()) : await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return isJson ? res.json() : res.text();
}

export async function api(path, options = {}) {
  const { headers, body, method, ...rest } = options;
  const final = {
    method: method || (body ? 'POST' : 'GET'),
    headers: buildHeaders(headers),
    body: typeof body === 'string' || body == null ? body : JSON.stringify(body),
    credentials: 'include',
    ...rest,
  };
  let res = await fetch(`${API_URL}${path}`, final);
  if (res.status === 401 && path !== '/auth/refresh') {
    // Try refresh once
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data?.token) {
          localStorage.setItem('TOKEN', data.token);
          // retry original request with new token
          final.headers = buildHeaders(headers);
          res = await fetch(`${API_URL}${path}`, final);
        }
      }
    } catch (_) {}
  }
  return handleResponse(res);
}

export const get = (path, opts = {}) => api(path, { ...opts, method: 'GET' });
export const post = (path, body, opts = {}) => api(path, { ...opts, method: 'POST', body });
export const put = (path, body, opts = {}) => api(path, { ...opts, method: 'PUT', body });
export const del = (path, opts = {}) => api(path, { ...opts, method: 'DELETE' });


