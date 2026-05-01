const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://settlement-ai-system-backend.onrender.com" || "http://localhost:8000";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("API request failed", path, error);
    throw error;
  }
}

export const api = {
  users: () => request(`/users`),
  createUser: (d) => request(`/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }),
  roadmap: (id) => request(`/users/${id}/generate-roadmap`, { method: 'POST' }),
  tasks: (id) => request(`/users/${id}/tasks`),
  updateTask: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }),
  passport: (id) => request(`/users/${id}/passport`),
  risk: (id) => request(`/users/${id}/risk`, { method: 'POST' }),
  dashboard: (role) => request(`/dashboard/${encodeURIComponent(role)}`),
  handoffs: () => request(`/handoffs`),
};
