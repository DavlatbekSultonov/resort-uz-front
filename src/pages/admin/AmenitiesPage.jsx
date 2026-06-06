import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from '../../api/services'

const CATEGORIES = [
  { value: 'ALOQA', label: '📡 Aloqa', desc: 'WiFi, TV, Telefon' },
  { value: 'TRANSPORT', label: '🚗 Transport', desc: 'Parking, Garaj, Transfer' },
  { value: 'IQLIM', label: '❄️ Iqlim', desc: 'Konditsioner, Isitish' },
  { value: 'OZIQ_OVQAT', label: '🍽️ Oziq-ovqat', desc: 'Oshxona, Muzlatgich' },
  { value: 'GIGIENA', label: '🧴 Gigiena', desc: 'Shampun, Sochiq, Fen' },
  { value: 'XAVFSIZLIK', label: '🔒 Xavfsizlik', desc: 'Kamera, Qo\'riqchi, Seyf' },
  { value: 'BOSHQA', label: '✨ Boshqa', desc: 'Boshqa qulayliklar' },
]

const ICONS = ['wifi', 'car', 'wind', 'utensils', 'shower', 'shield', 'star',
  'pool', 'tv', 'phone', 'parking', 'bed', 'coffee', 'dumbbell', 'baby']

const emptyForm = { name: '', category: 'ALOQA', icon: '' }

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAmenities() }, [])

  const fetchAmenities = () => {
    setLoading(true)
    getAmenities()
      .then(res => setAmenities(res.data.data || []))
      .catch(() => setAmenities([]))
      .finally(() => setLoading(false))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (modal.id) {
        await updateAmenity(modal.id, form)
      } else {
        await createAmenity(form)
      }
      setModal(null)
      setForm(emptyForm)
      fetchAmenities()
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" qulayligini o'chirishni tasdiqlaysizmi?`)) return
    try {
      await deleteAmenity(id)
      fetchAmenities()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  // Kategoriya bo'yicha guruhlash
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: amenities.filter(a => a.category === cat.value)
  })).filter(cat => cat.items.length > 0)

  const inp = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
  const lbl = { fontSize: 13, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 6 }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>✨ Qulayliklar</h1>
          <p style={{ color: '#9ca3af' }}>WiFi, Parking, Hovuz va boshqa qulayliklarni boshqarish</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setError(''); setModal({ id: null }) }} style={{
          padding: '12px 24px', background: '#1a6b3c', color: '#fff',
          borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer'
        }}>+ Qulaylik qo'shish</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #1a6b3c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : amenities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✨</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Qulayliklar yo'q</h3>
          <p style={{ color: '#9ca3af', marginBottom: 20 }}>WiFi, Parking kabi qulayliklarni qo'shing</p>
          <button onClick={() => { setForm(emptyForm); setModal({ id: null }) }} style={{
            padding: '12px 28px', borderRadius: 10, background: '#1a6b3c',
            color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer'
          }}>+ Birinchi qulaylikni qo'shish</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {grouped.map(cat => (
            <div key={cat.value} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ padding: '14px 20px', background: '#f9fafb', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{cat.label.split(' ')[0]}</span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{cat.label.split(' ').slice(1).join(' ')}</span>
                  <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 8 }}>{cat.desc}</span>
                </div>
                <span style={{ marginLeft: 'auto', background: '#e8f5ee', color: '#1a6b3c', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {cat.items.length} ta
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 16 }}>
                {cat.items.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                    {a.icon && <span style={{ fontSize: 16 }}>🔹</span>}
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                    <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
                      <button onClick={() => { setForm({ name: a.name, category: a.category, icon: a.icon || '' }); setError(''); setModal({ id: a.id }) }} style={{
                        width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb',
                        background: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>✏️</button>
                      <button onClick={() => handleDelete(a.id, a.name)} style={{
                        width: 28, height: 28, borderRadius: 6, border: '1px solid #fecaca',
                        background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Kategoriyasiz yoki barcha qulayliklar ro'yxati */}
          {amenities.filter(a => !grouped.find(g => g.value === a.category)?.items.includes(a)).length > 0 && (
            <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Boshqa</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {amenities.filter(a => !CATEGORIES.map(c => c.value).includes(a.category)).map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                    <button onClick={() => handleDelete(a.id, a.name)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
              {modal.id ? '✏️ Qulaylikni tahrirlash' : '+ Yangi qulaylik'}
            </h3>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={lbl}>Qulaylik nomi *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: WiFi, Bepul parking, Hovuz..."
                  style={inp}
                />
              </div>

              <div>
                <label style={lbl}>Kategoriya</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inp}>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label} — {c.desc}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => { setModal(null); setError('') }} style={{
                  flex: 1, padding: '12px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', background: '#fff'
                }}>Bekor</button>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                  background: '#1a6b3c', color: '#fff', fontWeight: 600,
                  fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
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
