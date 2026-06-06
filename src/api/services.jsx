import { userApi, adminApi, authApi } from './api'

// AUTH
export const login = (data) => authApi.post('/auth/login', data)

// AMENITIES
export const getAmenities = () => userApi.get('/amenities')
export const createAmenity = (data) => adminApi.post('/amenities/admin', data)
export const updateAmenity = (id, data) => adminApi.put(`/amenities/admin/${id}`, data)
export const deleteAmenity = (id) => adminApi.delete(`/amenities/admin/${id}`)

// RESORTS - public
export const getResorts = (page = 0, size = 12) =>
  userApi.get('/resorts', { params: { page, size } })
export const filterResorts = (params) =>
  userApi.get('/resorts/filter', { params })
export const getFeaturedResorts = () => userApi.get('/resorts/featured')
export const getResortById = (id) => userApi.get(`/resorts/${id}`)

// RESORTS - admin
export const getAdminResorts = (page = 0, size = 20) =>
  adminApi.get('/resorts/admin', { params: { page, size } })
export const createResort = (data) => adminApi.post('/resorts/admin', data)
export const updateResort = (id, data) => adminApi.put(`/resorts/admin/${id}`, data)
export const deleteResort = (id) => adminApi.delete(`/resorts/admin/${id}`)
export const toggleResort = (id) => adminApi.patch(`/resorts/admin/${id}/toggle`)

// PHOTOS
export const getPhotos = (resortId) => userApi.get(`/photos/${resortId}`)
export const uploadPhoto = (formData) =>
  adminApi.post('/photos/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const setCoverPhoto = (photoId) => adminApi.patch(`/photos/admin/${photoId}/cover`)
export const deletePhoto = (photoId) => adminApi.delete(`/photos/admin/${photoId}`)

// SERVICES
export const getServices = (resortId) => userApi.get(`/services/${resortId}`)
export const createService = (data) => adminApi.post('/services/admin', data)
export const updateService = (id, data) => adminApi.put(`/services/admin/${id}`, data)
export const deleteService = (id) => adminApi.delete(`/services/admin/${id}`)

// REVIEWS
export const getReviews = (resortId) => userApi.get(`/reviews/resort/${resortId}`)
export const createReview = (data) => userApi.post('/reviews', data)
export const deleteReview = (id) => adminApi.delete(`/reviews/admin/${id}`)

// BOOKINGS - public
export const createBooking = (data) => userApi.post('/bookings', data)
export const getActiveBookings = (resortId) => userApi.get(`/bookings/active/${resortId}`)

// BOOKINGS - admin
export const getAllBookings = (status, page = 0, size = 20) =>
  adminApi.get('/bookings/admin/all', { params: { status: status || undefined, page, size } })
export const getPendingBookings = (page = 0, size = 20) =>
  adminApi.get('/bookings/admin/pending', { params: { page, size } })
export const getBookingsByResort = (resortId, page = 0) =>
  adminApi.get(`/bookings/admin/resort/${resortId}`, { params: { page } })
export const confirmBooking = (id, note = '') =>
  adminApi.patch(`/bookings/admin/${id}/confirm`, null, { params: { note: note || undefined } })
export const cancelBooking = (id, note = '') =>
  adminApi.patch(`/bookings/admin/${id}/cancel`, null, { params: { reason: note || undefined } })

// ADMINS
export const getAdmins = () => adminApi.get('/admins/superadmin')
export const createAdmin = (data) => adminApi.post('/admins/superadmin', data)
export const updateAdmin = (id, data) => adminApi.put(`/admins/superadmin/${id}`, data)
export const deleteAdmin = (id) => adminApi.delete(`/admins/superadmin/${id}`)
export const getMe = () => adminApi.get('/admins/me')
