import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { adminApi } from '../../api/api'

const STATUS_LABELS = {
  KUTILMOQDA: 'Kutilmoqda',
  TASDIQLANGAN: 'Tasdiqlangan',
  BEKOR_QILINGAN: 'Bekor qilingan',
  YAKUNLANGAN: 'Yakunlangan',
}

const STATUS_COLORS = {
  KUTILMOQDA: { bg: '#fef3c7', color: '#d97706' },
  TASDIQLANGAN: { bg: '#d1fae5', color: '#059669' },
  BEKOR_QILINGAN: { bg: '#fee2e2', color: '#ef4444' },
  YAKUNLANGAN: { bg: '#e0e7ff', color: '#4f46e5' },
}

const STATUS_FILTERS = [
  { value: '', label: 'Barchasi' },
  { value: 'KUTILMOQDA', label: '⏳ Kutilmoqda' },
  { value: 'TASDIQLANGAN', label: '✅ Tasdiqlangan' },
  { value: 'BEKOR_QILINGAN', label: '❌ Bekor qilingan' },
  { value: 'YAKUNLANGAN', label: '🏁 Yakunlangan' },
]

// Kun o'tganligini tekshirish
const isExpired = (checkOutDate) => {
  if (!checkOutDate) return false
  return new Date(checkOutDate) < new Date(new Date().toDateString())
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [activeStatus, setActiveStatus] = useState('KUTILMOQDA')
  const [noteModal, setNoteModal] = useState(null)
  const [note, setNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Sana filterlari
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showDateFilter, setShowDateFilter] = useState(false)

  useEffect(() => { setPage(0) }, [activeStatus])
  useEffect(() => { fetchBookings() }, [page, activeStatus])

  const fetchBookings = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, size: 20 })
    if (activeStatus) params.append('status', activeStatus)
    adminApi.get(`/bookings/admin/all?${params}`)
      .then(res => {
        const data = res.data.data
        setBookings(data?.content || [])
        setTotalPages(data?.totalPages || 0)
        setTotalElements(data?.totalElements || 0)
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  const handleAction = async (type) => {
    if (!noteModal) return
    setActionLoading(true)
    try {
      if (type === 'confirm') {
        await adminApi.patch(`/bookings/admin/${noteModal.id}/confirm`, null, { params: { note } })
      } else {
        await adminApi.patch(`/bookings/admin/${noteModal.id}/cancel`, null, { params: { reason: note } })
      }
      setNoteModal(null)
      setNote('')
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async (id) => {
    if (!confirm("Bronni yakunlangan deb belgilaysizmi?")) return
    try {
      await adminApi.patch(`/bookings/admin/${id}/complete`)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  // Sana bo'yicha filtrash (frontend da)
  const filteredBookings = bookings.filter(b => {
    if (dateFrom && b.checkInDate < dateFrom) return false
    if (dateTo && b.checkOutDate > dateTo) return false
    return true
  })

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>📅 Bronlar'</h1>
        <p style={{ color: '#9ca3af' }}>
          {loading ? 'Yuklanmoqda...' : `${totalElements} ta bron topildi`}
        </p>
      </div>

      {/* Status filterlari */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setActiveStatus(f.value)} style={{
            padding: '8px 18px', borderRadius: 20, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', border: 'none',
            background: activeStatus === f.value ? '#1a6b3c' : '#fff',
            color: activeStatus === f.value ? '#fff' : '#374151',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>{f.label}</button>
        ))}

        {/* Sana filtri toggle */}
        <button onClick={() => setShowDateFilter(!showDateFilter)} style={{
          padding: '8px 18px', borderRadius: 20, fontWeight: 600, fontSize: 13,
          cursor: 'pointer', border: '1.5px solid #e5e7eb',
          background: showDateFilter ? '#f0fdf4' : '#fff',
          color: showDateFilter ? '#1a6b3c' : '#374151',
          marginLeft: 'auto'
        }}>📆 Sana bo'yicha</button>
      </div>

      {/* Sana filtri */}
      {showDateFilter && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>Kirish sanasi (dan):</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>Chiqish sanasi (gacha):</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13 }} />
          </div>
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo('') }} style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fff', cursor: 'pointer', fontSize: 12, color: '#6b7280'
            }}>✕ Tozalash</button>
          )}
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            {filteredBookings.length} ta natija
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #1a6b3c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{activeStatus === 'KUTILMOQDA' ? '✅' : '📭'}</div>
          <p style={{ color: '#9ca3af', fontSize: 16 }}>
            {activeStatus === 'KUTILMOQDA' ? "Kutilayotgan bronlar yo'q" :
             activeStatus === 'YAKUNLANGAN' ? "Yakunlangan bronlar yo'q" :
             activeStatus === 'BEKOR_QILINGAN' ? "Bekor qilingan bronlar yo'q" :
             activeStatus === 'TASDIQLANGAN' ? "Tasdiqlangan bronlar yo'q" :
             "Bronlar topilmadi"}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredBookings.map(b => {
              const expired = isExpired(b.checkOutDate) && b.status === 'TASDIQLANGAN'
              return (
                <div key={b.id} style={{
                  background: '#fff', borderRadius: 12, padding: '18px 22px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  borderLeft: '4px solid ' + (expired ? '#6366f1' : (STATUS_COLORS[b.status]?.color || '#e5e7eb')),
                  opacity: expired ? 0.9 : 1
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr auto', gap: 16, alignItems: 'center' }}>

                    {/* Mehmon */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{b.guestName}</div>
                      <div style={{ fontSize: 13, marginBottom: 3 }}>
                        📞 <a href={`tel:${b.guestPhone}`} style={{ color: '#1a6b3c', fontWeight: 600 }}>{b.guestPhone}</a>
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>🏕️ {b.resortName}</div>
                    </div>

                    {/* Sana */}
                    <div>
                      <div style={{ fontSize: 13, marginBottom: 4 }}>
                        📅 <strong>{b.checkInDate}</strong> → <strong>{b.checkOutDate}</strong>
                        {b.nights && <span style={{ color: '#9ca3af', fontSize: 12 }}> ({b.nights} kecha)</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 3 }}>
                        👥 {b.adultsCount} katta{b.childrenCount > 0 ? `, ${b.childrenCount} bola` : ''}
                      </div>
                      {b.totalPrice && (
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a6b3c' }}>
                          💰 {Number(b.totalPrice).toLocaleString()} {b.currency}
                        </div>
                      )}
                      {b.specialRequests && (
                        <div style={{ fontSize: 12, color: '#9ca3af', background: '#f9fafb', padding: '3px 8px', borderRadius: 6, marginTop: 4, display: 'inline-block' }}>
                          💬 {b.specialRequests}
                        </div>
                      )}
                    </div>

                    {/* Holat */}
                    <div>
                      <span style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: expired ? '#e0e7ff' : (STATUS_COLORS[b.status]?.bg || '#f3f4f6'),
                        color: expired ? '#4f46e5' : (STATUS_COLORS[b.status]?.color || '#374151')
                      }}>
                        {expired ? '🏁 Yakunlangan' : (STATUS_LABELS[b.status] || b.status)}
                      </span>
                      {expired && (
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Muddati o'tgan</div>
                      )}
                      {b.cancelReason && (
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Sabab: {b.cancelReason}</div>
                      )}
                    </div>

                    {/* Amallar */}
                    {b.status === 'KUTILMOQDA' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => { setNoteModal({ id: b.id, type: 'confirm', name: b.guestName }); setNote('') }} style={{
                          padding: '7px 14px', borderRadius: 7, border: 'none',
                          background: '#d1fae5', color: '#059669', fontWeight: 600, fontSize: 12, cursor: 'pointer'
                        }}>✅ Tasdiqlash</button>
                        <button onClick={() => { setNoteModal({ id: b.id, type: 'cancel', name: b.guestName }); setNote('') }} style={{
                          padding: '7px 14px', borderRadius: 7, border: 'none',
                          background: '#fee2e2', color: '#ef4444', fontWeight: 600, fontSize: 12, cursor: 'pointer'
                        }}>❌ Bekor qilish</button>
                      </div>
                    ) : (b.status === 'TASDIQLANGAN' && !expired) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => handleComplete(b.id)} style={{
                          padding: '7px 14px', borderRadius: 7, border: 'none',
                          background: '#e0e7ff', color: '#4f46e5', fontWeight: 600, fontSize: 12, cursor: 'pointer'
                        }}>🏁 Yakunlash</button>
                        <button onClick={() => { setNoteModal({ id: b.id, type: 'cancel', name: b.guestName }); setNote('') }} style={{
                          padding: '7px 14px', borderRadius: 7, border: 'none',
                          background: '#fee2e2', color: '#ef4444', fontWeight: 600, fontSize: 12, cursor: 'pointer'
                        }}>❌ Bekor qilish</button>
                      </div>
                    ) : <div />}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1.5px solid ' + (page === i ? '#1a6b3c' : '#e5e7eb'),
                  background: page === i ? '#1a6b3c' : '#fff',
                  color: page === i ? '#fff' : '#374151',
                  fontWeight: 600, cursor: 'pointer'
                }}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              {noteModal.type === 'confirm' ? '✅ Tasdiqlash' : '❌ Bekor qilish'}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20 }}>
              <strong>{noteModal.name}</strong> ning bronini {noteModal.type === 'confirm' ? 'tasdiqlaysizmi' : 'bekor qilasizmi'}?
            </p>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Izoh (ixtiyoriy)..." rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, resize: 'none', marginBottom: 20, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setNoteModal(null); setNote('') }} style={{
                flex: 1, padding: '12px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', background: '#fff'
              }}>Bekor</button>
              <button onClick={() => handleAction(noteModal.type)} disabled={actionLoading} style={{
                flex: 1, padding: '12px', borderRadius: 8, border: 'none',
                background: noteModal.type === 'confirm' ? '#059669' : '#ef4444',
                color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                opacity: actionLoading ? 0.7 : 1
              }}>
                {actionLoading ? 'Bajarilmoqda...' : noteModal.type === 'confirm' ? 'Tasdiqlash' : 'Bekor qilish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
