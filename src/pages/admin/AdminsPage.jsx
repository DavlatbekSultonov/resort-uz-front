import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../api/services'

const emptyForm = { username: '', password: '', fullName: '', phoneNumber: '', role: 'OWNER' }

export default function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { id } yoki null
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAdmins() }, [])

  const fetchAdmins = () => {
    setLoading(true)
    getAdmins()
      .then(res => setAdmins(res.data.data || []))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (modal.id) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateAdmin(modal.id, payload)
      } else {
        await createAdmin(form)
      }
      setModal(null)
      setForm(emptyForm)
      fetchAdmins()
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" adminni o'chirishni tasdiqlaysizmi?`)) return
    try {
      await deleteAdmin(id)
      fetchAdmins()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  const openCreate = () => {
    setForm(emptyForm)
    setError('')
    setModal({ id: null })
  }

  const openEdit = (a) => {
    setForm({ username: a.username, password: '', fullName: a.fullName, phoneNumber: a.phoneNumber || '', role: a.role })
    setError('')
    setModal({ id: a.id })
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, boxSizing: 'border-box' }
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-light)', display: 'block', marginBottom: 6 }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>👥 Adminlar</h1>
          <p style={{ color: 'var(--text-light)' }}>Tizim adminlarini boshqarish</p>
        </div>
        <button onClick={openCreate} style={{
          padding: '12px 24px', background: 'var(--primary)', color: '#fff',
          borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(26,107,60,0.3)'
        }}>+ Admin qo'shish</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)' }}>
                {['Admin', 'Username', 'Telefon', 'Rol', 'Holat', 'Amallar'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'rgba(249,250,251,0.5)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: a.role === 'SUPERADMIN' ? '#fef3c7' : 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                      }}>
                        {a.role === 'SUPERADMIN' ? '👑' : '👤'}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{a.fullName}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>@{a.username}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{a.phoneNumber || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: a.role === 'SUPERADMIN' ? '#fef3c7' : 'var(--primary-light)',
                      color: a.role === 'SUPERADMIN' ? '#d97706' : 'var(--primary)'
                    }}>
                      {a.role === 'SUPERADMIN' ? '👑 SUPERADMIN' : '👤 OWNER'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: a.active ? '#d1fae5' : '#fee2e2',
                      color: a.active ? '#059669' : '#ef4444'
                    }}>
                      {a.active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {a.role !== 'SUPERADMIN' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(a)} style={{
                          padding: '6px 14px', borderRadius: 7, border: '1.5px solid var(--border)',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff'
                        }}>✏️ Tahrir</button>
                        <button onClick={() => handleDelete(a.id, a.fullName)} style={{
                          padding: '6px 12px', borderRadius: 7, border: '1.5px solid #fecaca',
                          fontSize: 12, fontWeight: 600, color: '#ef4444', background: '#fff', cursor: 'pointer'
                        }}>🗑️</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
              {modal.id ? '✏️ Adminni tahrirlash' : '+ Yangi admin'}
            </h3>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>To'liq ism *</label>
                <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Ism Familiya" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Username *</label>
                <input required value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="username" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{modal.id ? "Yangi parol (bo'sh qoldirsa o'zgarmaydi)" : 'Parol *'}</label>
                <input type="password" required={!modal.id} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input value={form.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} placeholder="+998901234567" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Rol</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inputStyle}>
                  <option value="OWNER">👤 OWNER</option>
                  <option value="SUPERADMIN">👑 SUPERADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => { setModal(null); setError('') }} style={{
                  flex: 1, padding: '12px', borderRadius: 8, border: '1.5px solid var(--border)',
                  fontWeight: 600, cursor: 'pointer', background: '#fff', fontSize: 14
                }}>Bekor</button>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                  background: 'var(--primary)', color: '#fff',
                  fontWeight: 600, cursor: 'pointer', fontSize: 14,
                  opacity: saving ? 0.7 : 1
                }}>
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
