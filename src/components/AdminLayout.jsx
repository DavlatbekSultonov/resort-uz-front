import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logoutAdmin } = useAuth()
  const isSuperAdmin = admin?.role === 'SUPERADMIN'

  const menuItems = [
    { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { to: '/admin/maskanlar', icon: '🏕️', label: 'Maskanlar' },
    { to: '/admin/bookinglar', icon: '📅', label: 'Bookinglar' },
    ...(isSuperAdmin ? [
      { to: '/admin/qulayliklar', icon: '✨', label: 'Qulayliklar' },
      { to: '/admin/adminlar', icon: '👥', label: 'Adminlar' },
    ] : []),
  ]

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'linear-gradient(180deg, #0d4a28 0%, #1a6b3c 100%)', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏕️</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Dam Olish</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 3 }}>Kirgan:</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{admin?.fullName}</div>
          <span style={{ background: isSuperAdmin ? '#f59e0b' : 'rgba(255,255,255,0.18)', color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
            {isSuperAdmin ? '👑 SUPERADMIN' : '👤 OWNER'}
          </span>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {menuItems.map(item => (
            <Link key={item.to} to={item.to} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
              background: isActive(item) ? 'rgba(255,255,255,0.18)' : 'transparent',
              color: isActive(item) ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: isActive(item) ? 600 : 400, fontSize: 14,
              transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, color: 'rgba(255,255,255,0.65)', fontSize: 13, textDecoration: 'none', marginBottom: 4 }}>
            🌐 Saytga o'tish
          </Link>
          <button onClick={() => { logoutAdmin(); navigate('/admin/login') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.18)', color: '#fca5a5', fontSize: 13, border: 'none', cursor: 'pointer' }}>
            🚪 Chiqish
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
