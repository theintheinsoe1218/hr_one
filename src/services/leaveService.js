import api from '../utils/api'

export const getLeaves = (status = null) => {
    const params = status ? `?status=${status}` : ''
    return api.get(`/leaves${params}`)
}

export const createLeave = (payload) => api.post('/leaves', payload)

export const updateLeaveStatus = (id, status) =>
    api.patch(`/leaves/${id}/status?status=${status}`)
