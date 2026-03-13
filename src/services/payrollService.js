import api from '../utils/api'

export const getPayroll = (period) => api.get(`/payroll?period=${period}`)

export const createPayroll = (payload) => api.post('/payroll', payload)

export const updatePayrollStatus = (id, status) =>
    api.patch(`/payroll/${id}/status?status=${status}`)
