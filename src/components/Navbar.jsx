import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { LANGUAGES, t } from '../i18n/i18n'

export default function Navbar() {
  const location = useLocation()
  const { lang, changeLang } = useLang()

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>D</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 19, color: '#1a6b3c' }}>Dam Olish</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Til tanlash */}
          <div style={{ display: 'flex', gap: 4, marginRight: 8 }}>
            {Object.entries(LANGUAGES).map(([code, info]) => (
              <button key={code} onClick={() => changeLang(code)} style={{
                padding: '4px 8px', borderRadius: 6, border: 'none',
                background: lang === code ? '#1a6b3c' : '#f3f4f6',
                color: lang === code ? '#fff' : '#374151',
                fontWeight: 600, fontSize: 12, cursor: 'pointer'
              }}>
                {info.flag} {code.toUpperCase()}
              </button>
            ))}
          </div>

          <Link to="/" style={{
            padding: '7px 18px', borderRadius: 8, fontWeight: 500, fontSize: 15,
            textDecoration: 'none',
            color: location.pathname === '/' ? '#1a6b3c' : '#374151',
            background: location.pathname === '/' ? '#e8f5ee' : 'transparent',
          }}>{t(lang, 'nav.home')}</Link>

          <Link to="/maskanlar" style={{
            padding: '7px 18px', borderRadius: 8, fontWeight: 500, fontSize: 15,
            textDecoration: 'none',
            color: location.pathname === '/maskanlar' ? '#1a6b3c' : '#374151',
            background: location.pathname === '/maskanlar' ? '#e8f5ee' : 'transparent',
          }}>{t(lang, 'nav.resorts')}</Link>
        </div>
      </div>
    </nav>
  )
}
