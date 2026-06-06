import { Link } from 'react-router-dom'

const TYPE_LABELS = {
  DAM_OLISH_MASKANI: 'Dam olish',
  SANATORIY: 'Sanatoriy',
  MEHMONXONA: 'Mehmonxona',
  KOTEJ: 'Kotej',
  TURISTIK_BAZA: 'Turistik baza',
  AGROTURIZM: 'Agroturizm',
  TOGLIK_RESORT: "Tog'lik resort",
  SUV_YONI_RESORT: 'Suv yoni',
}

export default function ResortCard({ resort }) {
  const { id, name, resortType, regionName, address, pricePerNightMin, currency, averageRating, reviewCount, coverImageUrl, distanceKm, availableToday, featured } = resort

  return (
    <Link to={`/maskan/${id}`} style={{ display: 'block', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', textDecoration: 'none', color: 'var(--text)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)' }}
    >
      {/* Rasm */}
      <div style={{ position: 'relative', height: 210, background: '#e8f5ee', overflow: 'hidden' }}>
        {coverImageUrl
          ? <img src={coverImageUrl.replace('http://localhost:8080', '')} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>🏕️</div>
        }
        {/* Badgelar */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {featured && <span style={{ background: '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⭐ Tavsiya</span>}
          {availableToday === true && <span style={{ background: '#22c55e', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Bo'sh</span>}
          {availableToday === false && <span style={{ background: '#ef4444', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Band</span>}
        </div>
        {distanceKm && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>
            📍 {Math.round(distanceKm)} km
          </div>
        )}
      </div>

      {/* Kontent */}
      <div style={{ padding: '14px 18px 18px' }}>
        <div style={{ fontSize: 11, color: '#1a6b3c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          {TYPE_LABELS[resortType] || resortType}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 5, lineHeight: 1.3, color: '#1a1a2e' }}>{name}</h3>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>📌 {regionName} · {address}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#f59e0b' }}>★</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{averageRating?.toFixed(1) || '—'}</span>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>({reviewCount || 0})</span>
          </div>
          {pricePerNightMin && (
            <div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>dan </span>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#1a6b3c' }}>{Number(pricePerNightMin).toLocaleString()}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}> {currency === 'USD' ? '$' : "so'm"}/kecha</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
