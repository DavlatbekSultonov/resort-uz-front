import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../api/services'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      if (!res.data.success) { setError(res.data.message); return }
      const { token, ...admin } = res.data.data
      loginAdmin(token, admin)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || "Username yoki parol noto'g'ri")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '44px 36px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, margin: '0 auto 14px', background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏕️</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Panel</h1>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Dam Olish Maskanlari</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>Username</label>
            <input required value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="admin" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }}>Parol</label>
            <input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>⚠️ {error}</div>
          )}
          <button type="submit" disabled={loading} style={{ padding: '13px', background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  )
}
