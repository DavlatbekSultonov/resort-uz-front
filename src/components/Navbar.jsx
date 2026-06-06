import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const links = [
    { to: '/', label: 'Bosh sahifa' },
    { to: '/maskanlar', label: 'Maskanlar' },
  ]

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>D</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 19, color: '#1a6b3c' }}>Dam Olish</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '7px 18px', borderRadius: 8, fontWeight: 500, fontSize: 15,
              textDecoration: 'none',
              color: location.pathname === l.to ? '#1a6b3c' : '#374151',
              background: location.pathname === l.to ? '#e8f5ee' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
