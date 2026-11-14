const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export const getAllStudents = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/students${q ? '?' + q : ''}`);
};
export const getStudent = (id) => request(`/students/${id}`);
export const addStudent = (data) => request('/students', { method: 'POST', body: JSON.stringify(data) });
export const updateStudent = (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' });
export const getDashboard = () => request('/dashboard');
export const getAnalytics = () => request('/analytics');
export const getReport = (id) => request(`/reports/${id}`);
export const runSimulator = (data) => request('/simulator/execute', { method: 'POST', body: JSON.stringify(data) });
export const getSimulatorStatus = () => request('/simulator/status');
export const resetData = () => request('/settings/reset', { method: 'POST' });
export const exportData = () => request('/settings/export');
