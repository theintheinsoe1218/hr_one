import api from '../utils/api'

// ── Users ─────────────────────────────────────────────────
export const getUsers = () => api.get('/users')

export const createUser = (payload) => api.post('/users', payload)

export const updateUser = (id, payload) => api.put(`/users/${id}`, payload)

export const deleteUser = (id) => api.delete(`/users/${id}`)

// ── Roles ─────────────────────────────────────────────────
export const getRoles = () => api.get('/roles')
