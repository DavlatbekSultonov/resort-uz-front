import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import HomePage from './pages/user/HomePage'
import CatalogPage from './pages/user/CatalogPage'
import ResortDetailPage from './pages/user/ResortDetailPage'

import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ResortsPage from './pages/admin/ResortsPage'
import ResortFormPage from './pages/admin/ResortFormPage'
import BookingsPage from './pages/admin/BookingsPage'
import AdminsPage from './pages/admin/AdminsPage'
import AmenitiesPage from './pages/admin/AmenitiesPage'

function PrivateRoute({ children, superadminOnly = false }) {
  const { admin, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #1a6b3c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (!admin) return <Navigate to="/admin/login" />
  if (superadminOnly && admin.role !== 'SUPERADMIN') return <Navigate to="/admin" />
  return children
}

// Render uxlamasligi uchun har 14 daqiqada ping
if (typeof window !== 'undefined') {
  setInterval(() => {
    fetch('https://resort-uz.onrender.com/api/resorts?page=0&size=1')
      .catch(() => {})
  }, 5 * 60 * 1000)
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maskanlar" element={<CatalogPage />} />
          <Route path="/maskan/:id" element={<ResortDetailPage />} />

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/admin/maskanlar" element={<PrivateRoute><ResortsPage /></PrivateRoute>} />
          <Route path="/admin/maskanlar/yangi" element={<PrivateRoute><ResortFormPage /></PrivateRoute>} />
          <Route path="/admin/maskanlar/:id/tahrirlash" element={<PrivateRoute><ResortFormPage /></PrivateRoute>} />
          <Route path="/admin/bookinglar" element={<PrivateRoute><BookingsPage /></PrivateRoute>} />
          <Route path="/admin/adminlar" element={<PrivateRoute superadminOnly><AdminsPage /></PrivateRoute>} />
          <Route path="/admin/qulayliklar" element={<PrivateRoute superadminOnly><AmenitiesPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
