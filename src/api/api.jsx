import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

export const userApi = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
})

userApi.interceptors.response.use(
  res => res,
  err => {
    console.error('API xato:', err.response?.status, err.response?.data?.message)
    return Promise.reject(err)
  }
)

export const adminApi = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
})

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
})
