import api from '../utils/api'

// ── Employees ─────────────────────────────────────────────
export const getEmployees = () => api.get('/employees')

export const createEmployee = (payload) => api.post('/employees', payload)

export const deleteEmployee = (id) => api.delete(`/employees/${id}`)

// ── Departments ───────────────────────────────────────────
export const getDepartments = () => api.get('/departments')

export const createDepartment = (payload) => api.post('/departments', payload)

export const updateDepartment = (id, payload) => api.put(`/departments/${id}`, payload)

export const deleteDepartment = (id) => api.delete(`/departments/${id}`)
