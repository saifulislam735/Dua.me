const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}
