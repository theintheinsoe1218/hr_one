import api from '../utils/api'

export const getDashboardEmployees = () => api.get('/employees')

export const getDashboardLeaves = (status = null) => {
    const params = status ? `?status=${status}` : ''
    return api.get(`/leaves${params}`)
}
