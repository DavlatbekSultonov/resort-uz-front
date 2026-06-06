import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { getAdminResorts, deleteResort, toggleResort } from '../../api/services'

const RESORT_TYPE_LABELS = {
  DAM_OLISH_MASKANI: 'Dam olish',
  SANATORIY: 'Sanatoriy',
  MEHMONXONA: 'Mehmonxona',
  KOTEJ: 'Kotej',
  TURISTIK_BAZA: 'Turistik baza',
  AGROTURIZM: 'Agroturizm',
  TOGLIK_RESORT: "Tog'lik",
  SUV_YONI_RESORT: 'Suv yoni',
}

export default function ResortsPage() {
  const [resorts, setResorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => { fetchResorts() }, [page])

  const fetchResorts = () => {
    setLoading(true)
    getAdminResorts(page, 12)
      .then(res => {
        const data = res.data.data
        setResorts(data?.content || [])
        setTotalPages(data?.totalPages || 0)
        setTotalElements(data?.totalElements || 0)
      })
      .catch(() => setResorts([]))
      .finally(() => setLoading(false))
  }

  const handleToggle = async (id, name, active) => {
    if (!confirm(`"${name}" maskanini ${active ? "o'chirish" : 'faollashtirish'}ni tasdiqlaysizmi?`)) return
    try {
      await toggleResort(id)
      fetchResorts()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" maskanini butunlay o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi!`)) return
    try {
      await deleteResort(id)
      fetchResorts()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>🏕️ Maskanlar</h1>
          <p style={{ color: 'var(--text-light)' }}>
            {loading ? 'Yuklanmoqda...' : `Jami ${totalElements} ta maskan`}
          </p>
        </div>
        <Link to="/admin/maskanlar/yangi" style={{
          padding: '12px 24px', background: 'var(--primary)', color: '#fff',
          borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(26,107,60,0.3)'
        }}>+ Yangi maskan</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : resorts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏕️</div>
          <p style={{ color: 'var(--text-light)', marginBottom: 24, fontSize: 16 }}>Maskanlar yo'q</p>
          <Link to="/admin/maskanlar/yangi" style={{
            padding: '12px 28px', background: 'var(--primary)', color: '#fff',
            borderRadius: 10, fontWeight: 600, textDecoration: 'none'
          }}>+ Birinchi maskan qo'shish</Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)' }}>
                  {['Maskan', 'Viloyat', 'Tur', 'Narx', 'Reyting', 'Holat', 'Amallar'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resorts.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'rgba(249,250,251,0.5)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {r.coverImageUrl ? (
                          <img src={r.coverImageUrl} alt={r.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>🏕️</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                          {r.featured && <span style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}>⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)' }}>{r.regionName}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {RESORT_TYPE_LABELS[r.resortType] || r.resortType}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                      {r.pricePerNightMin ? `${Number(r.pricePerNightMin).toLocaleString()} ${r.currency}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>
                      <span style={{ color: '#f59e0b' }}>★</span> {r.averageRating?.toFixed(1) || '—'}
                      <span style={{ color: 'var(--text-light)', fontSize: 11 }}> ({r.reviewCount || 0})</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => handleToggle(r.id, r.name, r.active)} style={{
                        padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        background: r.active ? '#d1fae5' : '#fee2e2',
                        color: r.active ? '#059669' : '#ef4444'
                      }}>
                        {r.active ? '✓ Faol' : '✗ Nofaol'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/maskanlar/${r.id}/tahrirlash`} style={{
                          padding: '6px 14px', borderRadius: 7,
                          border: '1.5px solid var(--border)',
                          fontSize: 12, fontWeight: 600, color: 'var(--text)', textDecoration: 'none',
                          background: '#fff'
                        }}>✏️ Tahrir</Link>
                        <button onClick={() => handleDelete(r.id, r.name)} style={{
                          padding: '6px 12px', borderRadius: 7,
                          border: '1.5px solid #fecaca',
                          fontSize: 12, fontWeight: 600, color: '#ef4444',
                          background: '#fff', cursor: 'pointer'
                        }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{
                width: 36, height: 36, borderRadius: 8, border: '2px solid var(--border)',
                background: '#fff', fontWeight: 700, cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.4 : 1
              }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '2px solid ' + (page === i ? 'var(--primary)' : 'var(--border)'),
                  background: page === i ? 'var(--primary)' : '#fff',
                  color: page === i ? '#fff' : 'var(--text)',
                  fontWeight: 600, cursor: 'pointer'
                }}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{
                width: 36, height: 36, borderRadius: 8, border: '2px solid var(--border)',
                background: '#fff', fontWeight: 700, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: page === totalPages - 1 ? 0.4 : 1
              }}>›</button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
