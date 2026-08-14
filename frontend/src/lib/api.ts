import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};

// ── Leads ─────────────────────────────────────────────────────────────────────
export const leadsAPI = {
  create: (data: any) => api.post('/api/leads', data),
  list: (params?: any) => api.get('/api/leads', { params }),
  get: (id: string) => api.get(`/api/leads/${id}`),
  track: (id: string) => api.get(`/api/leads/status/${id}`),
  update: (id: string, data: any) => api.patch(`/api/leads/${id}`, data),
  analyze: (id: string) => api.post(`/api/leads/${id}/analyze`),
  extractRequirements: (id: string) => api.post(`/api/leads/${id}/requirements`),
  generateProposal: (id: string) => api.post(`/api/leads/${id}/proposal`),
  delete: (id: string) => api.delete(`/api/leads/${id}`),
};

// ── Proposals ─────────────────────────────────────────────────────────────────
export const proposalsAPI = {
  list: (params?: any) => api.get('/api/proposals', { params }),
  get: (id: string) => api.get(`/api/proposals/${id}`),
  downloadPdf: (id: string) =>
    api.get(`/api/proposals/${id}/pdf`, { responseType: 'blob' }),
  send: (id: string) => api.post(`/api/proposals/${id}/send`),
  update: (id: string, data: any) => api.patch(`/api/proposals/${id}`, data),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  get: () => api.get('/api/analytics'),
};

// ── Automation ────────────────────────────────────────────────────────────────
export const automationAPI = {
  getLogs: (leadId?: string) =>
    api.get('/api/automation/logs', { params: { lead_id: leadId } }),
};
