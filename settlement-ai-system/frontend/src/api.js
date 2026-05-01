const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const api = {
  users: () => fetch(`${BASE}/users`).then(r=>r.json()),
  createUser: (d) => fetch(`${BASE}/users`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d)}).then(r=>r.json()),
  roadmap: (id) => fetch(`${BASE}/users/${id}/generate-roadmap`, {method:'POST'}).then(r=>r.json()),
  tasks: (id) => fetch(`${BASE}/users/${id}/tasks`).then(r=>r.json()),
  updateTask: (id, status) => fetch(`${BASE}/tasks/${id}/status`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status})}).then(r=>r.json()),
  passport: (id) => fetch(`${BASE}/users/${id}/passport`).then(r=>r.json()),
  dashboard: (role) => fetch(`${BASE}/dashboard/${encodeURIComponent(role)}`).then(r=>r.json()),
};
