import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 12000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('campusflow_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error) => { if (error.response?.status === 401) window.dispatchEvent(new Event('campusflow:unauthorized')); return Promise.reject(error); });
export const errorMessage = (error) => error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'The request took too long. Please try again.' : 'We couldn’t connect to CampusFlow. Please check that the API is running.');
export default api;
