import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { t } from '../../i18n/i18n'
import Navbar from '../../components/Navbar'
import ResortCard from '../../components/ResortCard'
import { userApi } from '../../api/api'

const RESORT_TYPES = [
  { value: '', label: 'Barcha turlar' },
  { value: 'DAM_OLISH_MASKANI', label: "🏕️ Dam olish maskani" },
  { value: 'KOTEJ', label: '🏡 Kotej' },
  { value: 'SANATORIY', label: '🏥 Sanatoriy' },
  { value: 'MEHMONXONA', label: '🏨 Mehmonxona' },
  { value: 'TOGLIK_RESORT', label: "⛰️ Tog'lik resort" },
  { value: 'SUV_YONI_RESORT', label: '🏖️ Suv yoni resort' },
  { value: 'AGROTURIZM', label: '🌾 Agroturizm' },
  { value: 'TURISTIK_BAZA', label: '⛺ Turistik baza' },
]

const REGIONS = [
  { id: '', name: 'Barcha viloyatlar' },
  { id: 1, name: 'Toshkent viloyati' }, { id: 2, name: 'Toshkent shahar' },
  { id: 3, name: 'Andijon' }, { id: 4, name: "Farg'ona" },
  { id: 5, name: 'Namangan' }, { id: 6, name: 'Samarqand' },
  { id: 7, name: 'Buxoro' }, { id: 8, name: 'Navoiy' },
  { id: 9, name: 'Qashqadaryo' }, { id: 10, name: 'Surxondaryo' },
  { id: 11, name: 'Jizzax' }, { id: 12, name: 'Sirdaryo' },
  { id: 13, name: 'Xorazm' }, { id: 14, name: "Qoraqalpog'iston" },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [resorts, setResorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const { lang } = useLang()
  const [userCoords, setUserCoords] = useState(() => {
    const lat = searchParams.get('userLat')
    const lon = searchParams.get('userLon')
    if (lat && lon) return { lat: Number(lat), lon: Number(lon) }
    return null
  })
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')

  const init = {
    regionId: searchParams.get('regionId') || '',
    resortType: searchParams.get('resortType') || '',
    minPrice: '', maxPrice: '',
    search: searchParams.get('search') || '',
    checkIn: '', checkOut: '',
  }
  const [draft, setDraft] = useState(init)
  const [applied, setApplied] = useState(init)

  useEffect(() => { fetchResorts(applied, page, userCoords) }, [applied, page, userCoords])

  const fetchResorts = (f, p, coords) => {
    setLoading(true)
    const hasFilter = f.regionId || f.resortType || f.minPrice || f.maxPrice || f.search || f.checkIn || f.checkOut || coords

    const params = { page: p, size: 12 }
    if (hasFilter) {
      if (f.regionId) params.regionId = Number(f.regionId)
      if (f.resortType) params.resortType = f.resortType
      if (f.minPrice) params.minPrice = Number(f.minPrice)
      if (f.maxPrice) params.maxPrice = Number(f.maxPrice)
      if (f.search) params.search = f.search
      if (f.checkIn) params.checkIn = f.checkIn
      if (f.checkOut) params.checkOut = f.checkOut
      if (coords) { params.userLat = coords.lat; params.userLon = coords.lon }
    }

    const url = hasFilter ? '/resorts/filter' : '/resorts'
    userApi.get(url, { params })
      .then(res => {
        const data = res.data.data
        let list = data?.content || []
        // Geolokatsiya bo'lsa masofaga qarab saralash
        if (coords) {
          list = [...list].sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
        }
        setResorts(list)
        setTotalPages(data?.totalPages || 0)
        setTotalElements(data?.totalElements || 0)
      })
      .catch(() => setResorts([]))
      .finally(() => setLoading(false))
  }

  const handleSearch = () => { setPage(0); setApplied({ ...draft }) }

  const handleGeoSearch = () => {
    if (!navigator.geolocation) { setGeoError("Brauzer geolokatsiyani qo'llab-quvvatlamaydi"); return }
    setGeoLoading(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setUserCoords(coords)
        setPage(0)
        setGeoLoading(false)
      },
      () => {
        setGeoError("Joylashuvga ruxsat berilmadi")
        setGeoLoading(false)
      }
    )
  }

  const clearGeo = () => { setUserCoords(null); setPage(0) }

  const clearFilters = () => {
    const empty = { regionId: '', resortType: '', minPrice: '', maxPrice: '', search: '', checkIn: '', checkOut: '' }
    setDraft(empty); setApplied(empty); setUserCoords(null); setPage(0); setSearchParams({})
  }

  const hasActiveFilter = Object.values(applied).some(v => v !== '') || userCoords

  const inp = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, background: '#fff', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }
  const lbl = { fontSize: 11, fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', padding: '32px 0 40px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, marginBottom: 6 }}>🏕️ Maskanlar</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                {loading ? t(lang, 'catalog.loading') : `${totalElements} ${t(lang, 'catalog.found')}`}
                {userCoords && <span style={{ marginLeft: 10, background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 12, fontSize: 12 }}>📍 Sizga yaqinligi bo'yicha tartib</span>}
              </p>
            </div>
            {/* Geo tugma — headerda doim ko'rinadi */}
            <button
              onClick={userCoords ? clearGeo : handleGeoSearch}
              disabled={geoLoading}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none', cursor: geoLoading ? 'wait' : 'pointer',
                background: userCoords ? '#fff' : 'rgba(255,255,255,0.18)',
                color: userCoords ? '#1a6b3c' : '#fff',
                fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: userCoords ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {geoLoading ? '⏳ Aniqlanmoqda...' : userCoords ? t(lang, 'catalog.nearby_showing') : '📍 Menga yaqin maskanlar'}
            </button>
          </div>
          {geoError && (
            <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 8 }}>{geoError}</p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 24, alignItems: 'start' }}>

          {/* FILTER */}
          <aside style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', position: 'sticky', top: 80, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>🔽 Filtrlar</span>
              {hasActiveFilter && (
                <button onClick={clearFilters} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, cursor: 'pointer' }}>✕ Tozalash</button>
              )}
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Geolokatsiya tugmasi */}
              <button onClick={userCoords ? clearGeo : handleGeoSearch} disabled={geoLoading} style={{
                width: '100%', padding: '11px', borderRadius: 10, border: '1.5px solid',
                borderColor: userCoords ? '#1a6b3c' : '#e5e7eb',
                background: userCoords ? '#e8f5ee' : '#fff',
                color: userCoords ? '#1a6b3c' : '#374151',
                fontWeight: 600, fontSize: 14, cursor: geoLoading ? 'wait' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                {geoLoading ? '⏳ Joylashuv aniqlanmoqda...' : userCoords ? '✅ Sizga yaqin (o\'chirish)' : '📍 Menga yaqin maskanlar'}
              </button>
              {geoError && <p style={{ fontSize: 12, color: '#ef4444', margin: '-8px 0 0' }}>{geoError}</p>}

              <div>
                <label style={lbl}>Qidiruv</label>
                <input value={draft.search} onChange={e => setDraft(p => ({ ...p, search: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Maskan nomi yoki manzil..." style={inp} />
              </div>

              <div>
                <label style={lbl}>Viloyat</label>
                <select value={draft.regionId} onChange={e => setDraft(p => ({ ...p, regionId: e.target.value }))} style={inp}>
                  {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Maskan turi</label>
                <select value={draft.resortType} onChange={e => setDraft(p => ({ ...p, resortType: e.target.value }))} style={inp}>
                  {RESORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Narx (so'm/kecha)</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" value={draft.minPrice} onChange={e => setDraft(p => ({ ...p, minPrice: e.target.value }))} placeholder="Min" style={{ ...inp, width: '50%' }} />
                  <span style={{ color: '#9ca3af' }}>—</span>
                  <input type="number" value={draft.maxPrice} onChange={e => setDraft(p => ({ ...p, maxPrice: e.target.value }))} placeholder="Max" style={{ ...inp, width: '50%' }} />
                </div>
              </div>

              <div>
                <label style={lbl}>Kirish sanasi</label>
                <input type="date" value={draft.checkIn} onChange={e => setDraft(p => ({ ...p, checkIn: e.target.value }))} style={inp} />
              </div>

              <div>
                <label style={lbl}>Chiqish sanasi</label>
                <input type="date" value={draft.checkOut} onChange={e => setDraft(p => ({ ...p, checkOut: e.target.value }))} style={inp} />
              </div>

              <button onClick={handleSearch} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                🔍 Qidirish
              </button>
            </div>
          </aside>

          {/* NATIJALAR */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ height: 200, background: '#f0f0f0' }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5, marginBottom: 10, width: '40%' }} />
                      <div style={{ height: 18, background: '#f0f0f0', borderRadius: 5 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : resorts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 14 }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>Maskanlar topilmadi</h3>
                <p style={{ color: '#9ca3af', marginBottom: 20 }}>Boshqa filtr parametrlarini sinab ko'ring</p>
                <button onClick={clearFilters} style={{ padding: '10px 24px', borderRadius: 10, background: '#1a6b3c', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <>
                {userCoords && (
                  <div style={{ background: '#e8f5ee', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 14, color: '#1a6b3c', display: 'flex', alignItems: 'center', gap: 8 }}>
                    📍 Maskanlar sizdan masofaga qarab tartiblangan
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                  {resorts.map(r => <ResortCard key={r.id} resort={r} />)}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: 17, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)} style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid ' + (page === i ? '#1a6b3c' : '#e5e7eb'), background: page === i ? '#1a6b3c' : '#fff', color: page === i ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer' }}>{i + 1}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', fontWeight: 700, fontSize: 17, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page === totalPages - 1 ? 0.4 : 1 }}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
