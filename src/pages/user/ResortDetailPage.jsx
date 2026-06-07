import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getResortById, getReviews, createBooking, createReview, getActiveBookings } from '../../api/services'

const RESORT_TYPE_LABELS = {
  DAM_OLISH_MASKANI: 'Dam olish maskani',
  SANATORIY: 'Sanatoriy',
  MEHMONXONA: 'Mehmonxona',
  KOTEJ: 'Kotej',
  TURISTIK_BAZA: 'Turistik baza',
  AGROTURIZM: 'Agroturizm',
  TOGLIK_RESORT: "Tog'lik resort",
  SUV_YONI_RESORT: 'Suv yoni resort',
}

const SERVICE_TYPE_LABELS = {
  SUV_HAVZA: 'Suv havza',
  SPORT: 'Sport',
  OVQATLANISH: 'Ovqatlanish',
  BOLALAR: 'Bolalar',
  TRANSPORT: 'Transport',
  SOGLIKNI_SAQLASH: "Sog'liqni saqlash",
  FAOLLIK: 'Faollik',
  BOSHQA: 'Boshqa',
}

const NO_BOOKING_TYPES = ['DAM_OLISH_MASKANI', 'KOTEJ', 'TURISTIK_BAZA']
const canBook = r => !NO_BOOKING_TYPES.includes(r?.resortType)

export default function ResortDetailPage() {
  const { id } = useParams()
  const [resort, setResort] = useState(null)
  const [reviews, setReviews] = useState([])
  const [bookedDates, setBookedDates] = useState([])
  const [activeTab, setActiveTab] = useState('info')
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [lightbox, setLightbox] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const [booking, setBooking] = useState({
    guestName: '', guestPhone: '', checkInDate: '', checkOutDate: '',
    adultsCount: 1, childrenCount: 0, roomsCount: 1, specialRequests: ''
  })
  const [review, setReview] = useState({ guestName: '', rating: 5, comment: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getResortById(id),
      getReviews(id),
      getActiveBookings(id)
    ]).then(([r, rv, b]) => {
      setResort(r.data.data)
      setReviews(rv.data.data || [])
      setBookedDates(b.data.data || [])
    }).catch(() => {
      setResort(null)
    }).finally(() => setLoading(false))
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    setBookingError('')

    // Sana tekshirish
    if (booking.checkInDate >= booking.checkOutDate) {
      setBookingError("Ketish sanasi kelish sanasidan keyin bo'lishi kerak")
      return
    }

    setBookingLoading(true)
    try {
      const res = await createBooking({
        ...booking,
        resortId: parseInt(id),
        adultsCount: parseInt(booking.adultsCount),
        childrenCount: parseInt(booking.childrenCount),
        roomsCount: parseInt(booking.roomsCount),
      })
      if (res.data.success) {
        setBookingSuccess(true)
        setBooking({ guestName: '', guestPhone: '', checkInDate: '', checkOutDate: '', adultsCount: 1, childrenCount: 0, roomsCount: 1, specialRequests: '' })
      } else {
        setBookingError(res.data.message)
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setReviewLoading(true)
    try {
      await createReview({ ...review, resortId: parseInt(id) })
      setReviewSuccess(true)
      setReview({ guestName: '', rating: 5, comment: '' })
      const rv = await getReviews(id)
      setReviews(rv.data.data || [])
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return (
    <div><Navbar />
      <div style={{ textAlign: 'center', padding: 120 }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    </div>
  )

  if (!resort) return (
    <div><Navbar />
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ fontSize: 18, color: 'var(--text-light)' }}>Maskan topilmadi</p>
      </div>
    </div>
  )

  const photos = resort.photos || []
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, boxSizing: 'border-box' }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* PHOTO GALLERY */}
      {photos.length > 0 && (
        <div style={{ background: '#f1f5f9', padding: '16px 0' }}>
          <div className="container" style={{ padding: '0 24px' }}>
            {/* Asosiy katta rasm */}
            <div style={{ display: 'grid', gridTemplateColumns: photos.length > 1 ? '1fr 320px' : '1fr', gap: 12, marginBottom: 0 }}>
              {/* Chap — katta */}
              <div
                onClick={() => setLightbox(activePhoto)}
                style={{ borderRadius: 16, overflow: 'hidden', cursor: 'zoom-in', height: 440, position: 'relative', background: '#e2e8f0' }}
              >
                <img
                  src={photos[activePhoto]?.url?.replace('http://localhost:8080', '')}
                  alt={resort.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                  🔍 Kattalashtirish
                </div>
              </div>

              {/* O'ng — kichik thumbnaillar */}
              {photos.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 440, overflowY: 'auto' }}>
                  {photos.map((ph, i) => (
                    <div
                      key={ph.id}
                      onClick={() => setActivePhoto(i)}
                      style={{
                        borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                        height: photos.length <= 3 ? (440 / photos.length - 6) : 130,
                        border: i === activePhoto ? '3px solid #1a6b3c' : '3px solid transparent',
                        position: 'relative', background: '#e2e8f0'
                      }}
                    >
                      <img
                        src={ph.url?.replace('http://localhost:8080', '')}
                        alt={`${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      />
                      {i === activePhoto && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,107,60,0.15)' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox — katta ko'rish */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 20, cursor: 'pointer' }}>✕</button>

          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => Math.max(0, l - 1)) }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer' }}>‹</button>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => Math.min(photos.length - 1, l + 1)) }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer' }}>›</button>
            </>
          )}

          <img
            src={photos[lightbox]?.url?.replace('http://localhost:8080', '')}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }}
          />

          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow)', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {RESORT_TYPE_LABELS[resort.resortType] || resort.resortType}
                </span>
                {resort.featured && (
                  <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>⭐ Tavsiya</span>
                )}
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{resort.name}</h1>
              <p style={{ color: 'var(--text-light)', fontSize: 15, marginBottom: 16 }}>📌 {resort.regionName} · {resort.address}</p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
                  <strong>{resort.averageRating?.toFixed(1) || '—'}</strong>
                  <span style={{ color: 'var(--text-light)', fontSize: 14 }}>({resort.reviewCount || 0} sharh)</span>
                </div>
                {resort.distanceFromTashkent && (
                  <div>🚗 Toshkentdan <strong>{resort.distanceFromTashkent} km</strong></div>
                )}
                {resort.maxCapacity && (
                  <div>👥 <strong>{resort.maxCapacity}</strong> kishi</div>
                )}
                {resort.roomCount && (
                  <div>🛏 <strong>{resort.roomCount}</strong> xona</div>
                )}
              </div>
            </div>

            {/* TABS */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '2px solid var(--border)' }}>
                {[
                  { key: 'info', label: "Ma'lumot" },
                  { key: 'services', label: 'Xizmatlar' },
                  { key: 'reviews', label: `Sharhlar (${reviews.length})` },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                    flex: 1, padding: '16px', border: 'none', background: 'none',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-light)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                    marginBottom: -2
                  }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: 24 }}>

                {/* INFO */}
                {activeTab === 'info' && (
                  <div className="fade-in">
                    {(resort.fullDescription || resort.shortDescription) && (
                      <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24, color: 'var(--text)' }}>
                        {resort.fullDescription || resort.shortDescription}
                      </p>
                    )}

                    {resort.amenities?.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>✨ Qulayliklar</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {resort.amenities.map(a => (
                            <span key={a.id} style={{
                              padding: '6px 16px', background: 'var(--primary-light)',
                              color: 'var(--primary)', borderRadius: 20, fontSize: 13, fontWeight: 500
                            }}>✓ {a.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>📞 Aloqa</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {resort.phoneNumber && (
                          <div>📞 <a href={`tel:${resort.phoneNumber}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{resort.phoneNumber}</a></div>
                        )}
                        {resort.phoneNumber2 && (
                          <div>📞 <a href={`tel:${resort.phoneNumber2}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{resort.phoneNumber2}</a></div>
                        )}
                        {resort.email && <div>✉️ {resort.email}</div>}
                        {resort.websiteUrl && (
                          <div>🌐 <a href={resort.websiteUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{resort.websiteUrl}</a></div>
                        )}
                        {resort.telegramLink && (
                          <div>💬 <a href={resort.telegramLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Telegram</a></div>
                        )}
                        {resort.instagramLink && (
                          <div>📸 <a href={resort.instagramLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Instagram</a></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* XARITA */}
                {activeTab === 'info' && resort.latitude && resort.longitude && (
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>🗺️ Xaritada ko'rish</h3>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                      <iframe
                        title="Maskan joylashuvi"
                        width="100%"
                        height="300"
                        frameBorder="0"
                        style={{ display: 'block' }}
                        src={`https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=15&output=embed&hl=uz`}
                        allowFullScreen
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${resort.latitude},${resort.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}
                    >
                      🧭 Google Maps da ochish →
                    </a>
                  </div>
                )}

                {/* SERVICES */}
                {activeTab === 'services' && (
                  <div className="fade-in">
                    {!resort.services?.length ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🏊</div>
                        <p>Xizmatlar qo'shilmagan</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                        {resort.services.map(s => (
                          <div key={s.id} style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon || '⚡'}</div>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 8 }}>
                              {SERVICE_TYPE_LABELS[s.serviceType] || s.serviceType}
                            </div>
                            {s.isPaid && s.price
                              ? <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>{Number(s.price).toLocaleString()} {s.currency}</div>
                              : <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 13 }}>✓ Bepul</div>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === 'reviews' && (
                  <div className="fade-in">
                    {reviewSuccess ? (
                      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'center' }}>
                        ✅ Sharhingiz qabul qilindi!
                        <button onClick={() => setReviewSuccess(false)} style={{ display: 'block', margin: '10px auto 0', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                          Yana sharh yozish
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleReview} style={{ background: 'var(--bg)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>✍️ Sharh yozish</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <input required value={review.guestName} onChange={e => setReview(p => ({ ...p, guestName: e.target.value }))} placeholder="Ismingiz *" style={inputStyle} />
                          <div>
                            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block', color: 'var(--text-light)' }}>Baho</label>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} type="button" onClick={() => setReview(p => ({ ...p, rating: n }))} style={{
                                  fontSize: 28, background: 'none', border: 'none', cursor: 'pointer',
                                  color: n <= review.rating ? '#f59e0b' : '#d1d5db', transition: 'color 0.15s'
                                }}>★</button>
                              ))}
                            </div>
                          </div>
                          <textarea required value={review.comment} onChange={e => setReview(p => ({ ...p, comment: e.target.value }))} placeholder="Fikringiz... *" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                          <button type="submit" disabled={reviewLoading} style={{
                            padding: '10px 24px', background: 'var(--primary)', color: '#fff',
                            borderRadius: 8, fontWeight: 600, alignSelf: 'flex-start',
                            border: 'none', cursor: 'pointer', opacity: reviewLoading ? 0.7 : 1
                          }}>
                            {reviewLoading ? 'Yuborilmoqda...' : 'Sharh yuborish'}
                          </button>
                        </div>
                      </form>
                    )}

                    {reviews.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
                        <p>Hali sharhlar yo'q. Birinchi bo'ling!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {reviews.map(r => (
                          <div key={r.id} style={{ background: 'var(--bg)', borderRadius: 12, padding: 18, border: '1.5px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                              <strong style={{ fontSize: 15 }}>{r.guestName}</strong>
                              <span style={{ color: '#f59e0b', fontSize: 16 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            </div>
                            <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Booking */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-lg)', border: '1.5px solid var(--border)' }}>

              {resort.pricePerNightMin && (
                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  {NO_BOOKING_TYPES.includes(resort.resortType) ? (
                    // So'rov turlari uchun narx range
                    <>
                      <span style={{ fontSize: 13, color: 'var(--text-light)' }}>dan </span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--primary)' }}>
                        {Number(resort.pricePerNightMin).toLocaleString()}
                      </span>
                      {resort.pricePerNightMax && resort.pricePerNightMax !== resort.pricePerNightMin && (
                        <span style={{ fontSize: 16, color: 'var(--text-light)' }}>
                          {' — '}{Number(resort.pricePerNightMax).toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontSize: 14, color: 'var(--text-light)' }}> {resort.currency}/kecha</span>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                        * Aniq narx so'rov yuborilgandan keyin belgilanadi
                      </div>
                    </>
                  ) : (
                    // Band qilish turlari uchun aniq narx
                    <>
                      <span style={{ fontSize: 13, color: 'var(--text-light)' }}>dan </span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--primary)' }}>
                        {Number(resort.pricePerNightMin).toLocaleString()}
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-light)' }}> {resort.currency}/kecha</span>
                    </>
                  )}
                </div>
              )}

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 18 }}>So'rov yuborildi!</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: 14, marginBottom: 20 }}>
                    Admin tez orada siz bilan bog'lanadi.<br />
                    <strong>{resort.phoneNumber}</strong>
                  </p>
                  <button onClick={() => setBookingSuccess(false)} style={{
                    padding: '10px 24px', borderRadius: 8, background: 'var(--primary)',
                    color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer'
                  }}>Yana band qilish</button>
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                    {canBook(resort) ? '🗓 Band qilish' : '📞 So'rov yuborish'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    <input
                      required
                      value={booking.guestName}
                      onChange={e => setBooking(p => ({ ...p, guestName: e.target.value }))}
                      placeholder="Ismingiz *"
                      style={inputStyle}
                    />
                    <input
                      required
                      value={booking.guestPhone}
                      onChange={e => setBooking(p => ({ ...p, guestPhone: e.target.value }))}
                      placeholder="Telefon: +998... *"
                      style={inputStyle}
                    />

                    {canBook(resort) ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 12, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>Kirish *</label>
                            <input
                              required type="date"
                              min={today}
                              value={booking.checkInDate}
                              onChange={e => setBooking(p => ({ ...p, checkInDate: e.target.value }))}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>Chiqish *</label>
                            <input
                              required type="date"
                              min={booking.checkInDate || today}
                              value={booking.checkOutDate}
                              onChange={e => setBooking(p => ({ ...p, checkOutDate: e.target.value }))}
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 12, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>Kattalar</label>
                            <input type="number" min={1} value={booking.adultsCount} onChange={e => setBooking(p => ({ ...p, adultsCount: e.target.value }))} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ fontSize: 12, color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>Bolalar</label>
                            <input type="number" min={0} value={booking.childrenCount} onChange={e => setBooking(p => ({ ...p, childrenCount: e.target.value }))} style={inputStyle} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#166534' }}>
                        💡 Bu maskan uchun so'rov yuboring — admin siz bilan bog'lanib, narx va sana bo'yicha kelishadi.
                      </div>
                    )}

                    <textarea
                      value={booking.specialRequests}
                      onChange={e => setBooking(p => ({ ...p, specialRequests: e.target.value }))}
                      placeholder="Qo'shimcha xohish..."
                      rows={2}
                      style={{ ...inputStyle, resize: 'none' }}
                    />

                    {bookingError && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                        ⚠️ {bookingError}
                      </div>
                    )}

                    <button type="submit" disabled={bookingLoading} style={{
                      padding: '14px', background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)',
                      color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16,
                      border: 'none', cursor: 'pointer', opacity: bookingLoading ? 0.7 : 1,
                      boxShadow: '0 4px 12px rgba(26,107,60,0.3)'
                    }}>
                      {bookingLoading ? 'Yuborilmoqda...' : canBook(resort) ? '📅 Band qilish' : '📞 So\'rov yuborish'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {bookedDates.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginTop: 16, border: '1.5px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>🗓 Band sanalar</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bookedDates.map((b, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#ef4444', background: '#fef2f2', padding: '6px 12px', borderRadius: 6 }}>
                      {b.checkInDate} → {b.checkOutDate}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
