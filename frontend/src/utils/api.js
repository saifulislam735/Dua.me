const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), 'Content-Type': 'application/json' }
  });

  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.status}`);
  }

  return data;
}

export function apiWithAuth(path, token, options = {}) {
  return api(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
}
