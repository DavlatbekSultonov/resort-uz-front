import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { getAdminResorts, getPendingBookings } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const { admin } = useAuth()
  const [resorts, setResorts] = useState([])
  const [pendingBookings, setPendingBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdminResorts(0, 100),
      getPendingBookings(0, 5)
    ]).then(([r, b]) => {
      setResorts(r.data.data?.content || [])
      setPendingBookings(b.data.data?.content || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeResorts = resorts.filter(r => r.active).length
  const avgRating = resorts.length > 0
    ? (resorts.reduce((s, r) => s + (r.averageRating || 0), 0) / resorts.length).toFixed(1)
    : '—'

  const statCards = [
    { icon: '🏕️', label: 'Jami maskanlar', value: resorts.length, color: '#1a6b3c', bg: '#e8f5ee', to: '/admin/maskanlar' },
    { icon: '✅', label: 'Faol maskanlar', value: activeResorts, color: '#059669', bg: '#d1fae5', to: '/admin/maskanlar' },
    { icon: '⏳', label: 'Kutilayotgan bronlar', value: pendingBookings.length, color: '#d97706', bg: '#fef3c7', to: '/admin/bookinglar' },
    { icon: '⭐', label: "O'rtacha reyting", value: avgRating, color: '#7c3aed', bg: '#ede9fe', to: '/admin/maskanlar' },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
          Salom, {admin?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-light)' }}>Dam Olish Maskanlari boshqaruv paneli</p>
      </div>

      {/* Stat kartalar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {statCards.map(s => (
          <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: 24,
              boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                  {loading ? '...' : s.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Kutilayotgan bronlar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>⏳ Kutilayotgan bronlar</h2>
            <Link to="/admin/bookinglar" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Barchasi →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-light)' }}>Yuklanmoqda...</p>
          ) : pendingBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <p style={{ color: 'var(--text-light)' }}>Kutilayotgan bronlar yo'q</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingBookings.map(b => (
                <div key={b.id} style={{ padding: '14px 16px', background: 'var(--bg)', borderRadius: 10, borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14 }}>{b.guestName}</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.checkInDate} → {b.checkOutDate}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 2 }}>🏕️ {b.resortName}</div>
                  <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
                    📞 <a href={`tel:${b.guestPhone}`} style={{ color: 'var(--primary)' }}>{b.guestPhone}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maskanlar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>🏕️ Maskanlarim</h2>
            <Link to="/admin/maskanlar" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Barchasi →</Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-light)' }}>Yuklanmoqda...</p>
          ) : resorts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏕️</div>
              <p style={{ color: 'var(--text-light)', marginBottom: 16 }}>Maskanlar yo'q</p>
              <Link to="/admin/maskanlar/yangi" style={{
                padding: '10px 20px', background: 'var(--primary)', color: '#fff',
                borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none'
              }}>+ Maskan qo'shish</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {resorts.slice(0, 5).map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      ⭐ {r.averageRating?.toFixed(1) || '—'} · {r.reviewCount || 0} sharh
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: r.active ? '#d1fae5' : '#fee2e2',
                    color: r.active ? '#059669' : '#ef4444'
                  }}>
                    {r.active ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
