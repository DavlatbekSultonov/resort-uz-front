import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import ResortCard from '../../components/ResortCard'
import { getFeaturedResorts } from '../../api/services'

const RESORT_TYPES = [
  { value: 'DAM_OLISH_MASKANI', label: '🏕️ Dam olish' },
  { value: 'KOTEJ', label: '🏡 Kotej' },
  { value: 'SANATORIY', label: '🏥 Sanatoriy' },
  { value: 'MEHMONXONA', label: '🏨 Mehmonxona' },
  { value: 'TOGLIK_RESORT', label: "⛰️ Tog'lik" },
  { value: 'SUV_YONI_RESORT', label: '🏖️ Suv yoni' },
  { value: 'AGROTURIZM', label: '🌾 Agro' },
  { value: 'TURISTIK_BAZA', label: '⛺ Turistik baza' },
]

const REGIONS = [
  { id: 1, name: 'Toshkent viloyati' }, { id: 2, name: 'Toshkent shahar' },
  { id: 3, name: 'Andijon' }, { id: 4, name: "Farg'ona" },
  { id: 5, name: 'Namangan' }, { id: 6, name: 'Samarqand' },
  { id: 7, name: 'Buxoro' }, { id: 8, name: 'Navoiy' },
  { id: 9, name: 'Qashqadaryo' }, { id: 10, name: 'Surxondaryo' },
  { id: 11, name: 'Jizzax' }, { id: 12, name: 'Sirdaryo' },
  { id: 13, name: 'Xorazm' }, { id: 14, name: "Qoraqalpog'iston" },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [geoLoading, setGeoLoading] = useState(false)

  const handleNearby = () => {
    if (!navigator.geolocation) { alert("Brauzer joylashuvni qo'llab-quvvatlamaydi"); return }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoLoading(false)
        navigate(`/maskanlar?userLat=${pos.coords.latitude}&userLon=${pos.coords.longitude}`)
      },
      () => { setGeoLoading(false); alert("Joylashuvga ruxsat berilmadi") }
    )
  }
  const [featured, setFeatured] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedResorts()
      .then(res => setFeatured(res.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/maskanlar?search=${encodeURIComponent(search.trim())}`)
    else navigate('/maskanlar')
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0d4a28 0%, #1a6b3c 60%, #2d8a54 100%)', minHeight: 500, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center', padding: '70px 24px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', padding: '6px 18px', borderRadius: 20, marginBottom: 20 }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>🌿 O'zbekiston bo'ylab dam olish</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 58px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.2, fontFamily: 'Playfair Display, serif' }}>
            Dam Olish Maskanlari
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 36 }}>
            O'zbekistonning eng go'zal joylarda dam oling
          </p>

          <form onSubmit={handleSearch} style={{ background: '#fff', borderRadius: 14, padding: 6, display: 'flex', gap: 6, maxWidth: 560, margin: '0 auto', boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Maskan nomi yoki manzil..."
              style={{ flex: 1, border: 'none', padding: '12px 16px', fontSize: 15, borderRadius: 10, background: '#f9fafb', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              🔍 Qidirish
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 8 }}>
            <button onClick={handleNearby} disabled={geoLoading} style={{
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', padding: '10px 24px', borderRadius: 25, fontWeight: 600, fontSize: 14,
              cursor: geoLoading ? 'wait' : 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              {geoLoading ? "⏳ Joylashuv aniqlanmoqda..." : "📍 Menga yaqin maskanlarni ko'rsating"}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 28, flexWrap: 'wrap' }}>
            {[{ n: '100+', l: 'Maskan' }, { n: '14', l: 'Viloyat' }, { n: '1000+', l: 'Mehmon' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>{s.n}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASKAN TURLARI */}
      <section style={{ padding: '52px 0 36px', background: '#fff' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 28, fontFamily: 'Playfair Display, serif' }}>Maskan turlari</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {RESORT_TYPES.map(t => (
              <button key={t.value} onClick={() => navigate(`/maskanlar?resortType=${t.value}`)} style={{ padding: '10px 20px', borderRadius: 50, border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6b3c'; e.currentTarget.style.color = '#1a6b3c'; e.currentTarget.style.background = '#e8f5ee' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff' }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* VILOYATLAR */}
      <section style={{ padding: '36px 0', background: '#f9fafb' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 28, fontFamily: 'Playfair Display, serif' }}>Viloyatlar bo'yicha</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {REGIONS.map(r => (
              <button key={r.id} onClick={() => navigate(`/maskanlar?regionId=${r.id}`)} style={{ padding: '14px 10px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', textAlign: 'center', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6b3c'; e.currentTarget.style.background = '#e8f5ee' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff' }}
              >🗺️ {r.name}</button>
            ))}
          </div>
        </div>
      </section>

      {/* TAVSIYA ETILGAN */}
      <section style={{ padding: '52px 0' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>⭐ Tavsiya etilgan maskanlar</h2>
            <button onClick={() => navigate('/maskanlar')} style={{ padding: '10px 22px', borderRadius: 10, border: '1.5px solid #1a6b3c', color: '#1a6b3c', fontWeight: 600, background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
              Barchasini ko'rish →
            </button>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                  <div style={{ height: 210, background: '#f0f0f0' }} />
                  <div style={{ padding: 18 }}>
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, marginBottom: 10, width: '40%' }} />
                    <div style={{ height: 20, background: '#f0f0f0', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏕️</div>
              <p>Hozircha tavsiya etilgan maskanlar yo'q</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {featured.map(r => <ResortCard key={r.id} resort={r} />)}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0d4a28', color: 'rgba(255,255,255,0.7)', padding: '36px 0 20px' }}>
        <div className="container" style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>Dam Olish Maskanlari</div>
          <p style={{ fontSize: 14, marginBottom: 20 }}>O'zbekistondagi eng yaxshi dam olish joylari</p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 16, fontSize: 13 }}>
            © 2026 Dam Olish Maskanlari. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  )
}
