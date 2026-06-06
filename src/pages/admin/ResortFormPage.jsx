import { useState, useEffect, useRef } from 'react'
import LeafletMap from '../../components/LeafletMap'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import {
  createResort, updateResort, getResortById, getAmenities,
  uploadPhoto, getPhotos, deletePhoto, setCoverPhoto, getAdmins
} from '../../api/services'
import { useAuth } from '../../context/AuthContext'

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

const REGIONS = [
  { id: 1, name: 'Toshkent viloyati' },
  { id: 2, name: 'Toshkent shahar' },
  { id: 3, name: 'Andijon' },
  { id: 4, name: "Farg'ona" },
  { id: 5, name: 'Namangan' },
  { id: 6, name: 'Samarqand' },
  { id: 7, name: 'Buxoro' },
  { id: 8, name: 'Navoiy' },
  { id: 9, name: 'Qashqadaryo' },
  { id: 10, name: 'Surxondaryo' },
  { id: 11, name: 'Jizzax' },
  { id: 12, name: 'Sirdaryo' },
  { id: 13, name: 'Xorazm' },
  { id: 14, name: "Qoraqalpog'iston" },
]

const emptyForm = {
  name: '', shortDescription: '', fullDescription: '',
  resortType: 'DAM_OLISH_MASKANI', regionId: '',
  address: '', latitude: '', longitude: '', distanceFromTashkent: '',
  pricePerNightMin: '', pricePerNightMax: '', currency: 'UZS',
  phoneNumber: '', phoneNumber2: '', email: '', websiteUrl: '',
  telegramLink: '', instagramLink: '',
  maxCapacity: '', roomCount: '', cottageCount: '',
  openYearRound: true, openMonth: '', closeMonth: '',
  featured: false, active: true,
  amenityIds: [], ownerId: ''
}

export default function ResortFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { admin } = useAuth()
  const isEdit = !!id
  const isSuperAdmin = admin?.role === 'SUPERADMIN'

  const [amenities, setAmenities] = useState([])
  const [owners, setOwners] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const requests = [
      getAmenities(),
      isSuperAdmin ? getAdmins() : Promise.resolve({ data: { data: [] } })
    ]

    Promise.all(requests).then(([amenitiesRes, adminsRes]) => {
      setAmenities(amenitiesRes.data.data || [])
      setOwners((adminsRes.data.data || []).filter(u => u.role === 'OWNER'))

      if (isEdit) {
        return Promise.all([getResortById(id), getPhotos(id)])
          .then(([resortRes, photosRes]) => {
            const d = resortRes.data.data
            if (!d) return
            setForm({
              name: d.name || '',
              shortDescription: d.shortDescription || '',
              fullDescription: d.fullDescription || '',
              resortType: d.resortType || 'DAM_OLISH_MASKANI',
              regionId: d.regionId ? String(d.regionId) : '',
              address: d.address || '',
              latitude: d.latitude || '',
              longitude: d.longitude || '',
              distanceFromTashkent: d.distanceFromTashkent || '',
              pricePerNightMin: d.pricePerNightMin || '',
              pricePerNightMax: d.pricePerNightMax || '',
              currency: d.currency || 'UZS',
              phoneNumber: d.phoneNumber || '',
              phoneNumber2: d.phoneNumber2 || '',
              email: d.email || '',
              websiteUrl: d.websiteUrl || '',
              telegramLink: d.telegramLink || '',
              instagramLink: d.instagramLink || '',
              maxCapacity: d.maxCapacity || '',
              roomCount: d.roomCount || '',
              cottageCount: d.cottageCount || '',
              openYearRound: d.openYearRound ?? true,
              openMonth: d.openMonth || '',
              closeMonth: d.closeMonth || '',
              featured: d.featured ?? false,
              active: d.active ?? true,
              amenityIds: d.amenities?.map(a => a.id) || [],
              ownerId: d.adminId ? String(d.adminId) : ''
            })
            setPhotos(photosRes.data.data || [])
          })
      }
    }).finally(() => setPageLoading(false))
  }, [id])

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Brauzer geolokatsiyani qo'llab-quvvatlamaydi")
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(p => ({
          ...p,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }))
      },
      () => alert("Joylashuvga ruxsat berilmadi")
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.regionId) { setError("Viloyatni tanlang"); return }
    if (!form.phoneNumber) { setError("Telefon raqam kiriting"); return }

    setLoading(true)
    try {
      const payload = {
        ...form,
        regionId: Number(form.regionId),
        ownerId: form.ownerId ? Number(form.ownerId) : null,
        pricePerNightMin: form.pricePerNightMin ? Number(form.pricePerNightMin) : null,
        pricePerNightMax: form.pricePerNightMax ? Number(form.pricePerNightMax) : null,
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
        roomCount: form.roomCount ? Number(form.roomCount) : null,
        cottageCount: form.cottageCount ? Number(form.cottageCount) : null,
        distanceFromTashkent: form.distanceFromTashkent ? Number(form.distanceFromTashkent) : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      }
      if (!payload.ownerId) delete payload.ownerId

      if (isEdit) {
        await updateResort(id, payload)
      } else {
        await createResort(payload)
      }
      navigate('/admin/maskanlar')
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length || !isEdit) return
    setPhotoLoading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('resortId', id)
      fd.append('isCover', photos.length === 0 ? 'true' : 'false')
      try { await uploadPhoto(fd) } catch (err) { console.error(err) }
    }
    const res = await getPhotos(id)
    setPhotos(res.data.data || [])
    setPhotoLoading(false)
    e.target.value = ''
  }

  const handleSetCover = async (photoId) => {
    await setCoverPhoto(photoId)
    const res = await getPhotos(id)
    setPhotos(res.data.data || [])
  }

  const handleDeletePhoto = async (photoId) => {
    if (!confirm("Rasmni o'chirishni tasdiqlaysizmi?")) return
    await deletePhoto(photoId)
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const toggleAmenity = (amenityId) => {
    setForm(prev => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter(i => i !== amenityId)
        : [...prev.amenityIds, amenityId]
    }))
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid var(--border)', fontSize: 14, boxSizing: 'border-box'
  }
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: 'var(--text-light)',
    marginBottom: 6, display: 'block'
  }
  const sectionStyle = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: 'var(--shadow)', marginBottom: 20
  }

  if (pageLoading) return (
    <AdminLayout>
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            {isEdit ? '✏️ Maskanni tahrirlash' : '+ Yangi maskan'}
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            {isEdit ? "Ma'lumotlarni yangilash" : "Yangi maskan qo'shish"}
          </p>
        </div>
        <button onClick={() => navigate('/admin/maskanlar')} style={{
          padding: '10px 20px', borderRadius: 8, border: '1.5px solid var(--border)',
          background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer'
        }}>← Orqaga</button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '14px 20px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Asosiy */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>📋 Asosiy ma'lumot</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Maskan nomi *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Maskan nomi" style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Viloyat *</label>
                    <select required value={String(form.regionId)} onChange={e => setForm(p => ({ ...p, regionId: e.target.value }))} style={inputStyle}>
                      <option value="">Tanlang...</option>
                      {REGIONS.map(r => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Maskan turi *</label>
                    <select required value={form.resortType} onChange={e => setForm(p => ({ ...p, resortType: e.target.value }))} style={inputStyle}>
                      {Object.entries(RESORT_TYPE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Qisqa tavsif</label>
                  <input value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} placeholder="Qisqa tavsif (karta uchun)" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>To'liq tavsif</label>
                  <textarea rows={4} value={form.fullDescription} onChange={e => setForm(p => ({ ...p, fullDescription: e.target.value }))} placeholder="Batafsil ma'lumot..." style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                {isSuperAdmin && owners.length > 0 && (
                  <div>
                    <label style={labelStyle}>Owner (egasi)</label>
                    <select value={String(form.ownerId)} onChange={e => setForm(p => ({ ...p, ownerId: e.target.value }))} style={inputStyle}>
                      <option value="">SUPERADMIN (o'zim)</option>
                      {owners.map(o => <option key={o.id} value={String(o.id)}>{o.fullName} (@{o.username})</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Manzil */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>📍 Manzil</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Manzil *</label>
                  <input required value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="To'liq manzil" style={inputStyle} />
                </div>

                {/* Xaritada belgilash — Leaflet */}
                <div>
                  <label style={labelStyle}>Xaritada belgilash</label>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
                    Xaritaga bosing — koordinatalar avtomatik to'ldiriladi
                  </p>
                  <LeafletMap
                    lat={form.latitude}
                    lon={form.longitude}
                    onSelect={(lat, lon) => setForm(p => ({ ...p, latitude: lat, longitude: lon }))}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={getMyLocation} style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #1a6b3c', background: '#e8f5ee', color: '#1a6b3c', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      📍 Mening joylashuvim
                    </button>
                    <button type="button" onClick={() => setForm(p => ({ ...p, latitude: '', longitude: '' }))} style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      ✕ Tozalash
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Kenglik (lat)</label>
                    <input type="number" step="any" value={form.latitude} onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))} placeholder="41.2995" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Uzunlik (lon)</label>
                    <input type="number" step="any" value={form.longitude} onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))} placeholder="69.2401" style={inputStyle} />
                  </div>

                </div>
              </div>
            </div>

            {/* Aloqa */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>📞 Aloqa</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Telefon *</label>
                  <input required value={form.phoneNumber} onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))} placeholder="+998901234567" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon 2</label>
                  <input value={form.phoneNumber2} onChange={e => setForm(p => ({ ...p, phoneNumber2: e.target.value }))} placeholder="+998901234567" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="info@maskan.uz" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input value={form.websiteUrl} onChange={e => setForm(p => ({ ...p, websiteUrl: e.target.value }))} placeholder="https://..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telegram</label>
                  <input value={form.telegramLink} onChange={e => setForm(p => ({ ...p, telegramLink: e.target.value }))} placeholder="https://t.me/..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Instagram</label>
                  <input value={form.instagramLink} onChange={e => setForm(p => ({ ...p, instagramLink: e.target.value }))} placeholder="https://instagram.com/..." style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Qulayliklar */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>✨ Qulayliklar</h3>
              {amenities.length === 0 ? (
                <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Qulayliklar yo'q — admin panelda avval qo'shing</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {amenities.map(am => (
                    <button key={am.id} type="button" onClick={() => toggleAmenity(am.id)} style={{
                      padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: '1.5px solid ' + (form.amenityIds.includes(am.id) ? 'var(--primary)' : 'var(--border)'),
                      background: form.amenityIds.includes(am.id) ? 'var(--primary-light)' : '#fff',
                      color: form.amenityIds.includes(am.id) ? 'var(--primary)' : 'var(--text)',
                      transition: 'all 0.15s'
                    }}>
                      {form.amenityIds.includes(am.id) ? '✓ ' : ''}{am.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rasmlar — faqat tahrirlashda */}
            {isEdit && (
              <div style={sectionStyle}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🖼️ Rasmlar</h3>
                {photos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
                    {photos.map(ph => (
                      <div key={ph.id} style={{
                        borderRadius: 10, overflow: 'hidden',
                        border: ph.isCover ? '3px solid var(--primary)' : '1.5px solid var(--border)'
                      }}>
                        <div style={{ position: 'relative' }}>
                          <img src={ph.url?.replace('http://localhost:8080', '')} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                          {ph.isCover && (
                            <div style={{ position: 'absolute', top: 6, left: 6, background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                              COVER
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 4, padding: '6px 6px' }}>
                          {!ph.isCover && (
                            <button type="button" onClick={() => handleSetCover(ph.id)} style={{
                              flex: 1, padding: '4px', borderRadius: 5, border: '1px solid var(--border)',
                              fontSize: 11, cursor: 'pointer', background: '#fff', fontWeight: 600
                            }}>Cover</button>
                          )}
                          <button type="button" onClick={() => handleDeletePhoto(ph.id)} style={{
                            flex: 1, padding: '4px', borderRadius: 5, border: '1px solid #fecaca',
                            color: '#ef4444', fontSize: 11, cursor: 'pointer', background: '#fff'
                          }}>O'chir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', background: 'var(--primary-light)',
                  color: 'var(--primary)', borderRadius: 8, fontWeight: 600,
                  fontSize: 13, cursor: photoLoading ? 'not-allowed' : 'pointer'
                }}>
                  {photoLoading ? '⏳ Yuklanmoqda...' : '+ Rasm qo\'shish'}
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={photoLoading} />
                </label>
                {!isEdit && (
                  <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>
                    💡 Maskan saqlangandan so'ng rasm yuklash mumkin
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* Narx */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>💰 Narx</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Min narx (kechasi)</label>
                  <input type="number" value={form.pricePerNightMin} onChange={e => setForm(p => ({ ...p, pricePerNightMin: e.target.value }))} placeholder="300000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Max narx (kechasi)</label>
                  <input type="number" value={form.pricePerNightMax} onChange={e => setForm(p => ({ ...p, pricePerNightMax: e.target.value }))} placeholder="800000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Valyuta</label>
                  <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} style={inputStyle}>
                    <option value="UZS">UZS (so'm)</option>
                    <option value="USD">USD (dollar)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sig'im */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🏠 Sig'im</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Max sig'im (kishi)</label>
                  <input type="number" min={1} value={form.maxCapacity} onChange={e => setForm(p => ({ ...p, maxCapacity: e.target.value }))} placeholder="50" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Xonalar soni</label>
                  <input type="number" min={0} value={form.roomCount} onChange={e => setForm(p => ({ ...p, roomCount: e.target.value }))} placeholder="10" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Kotejlar soni</label>
                  <input type="number" min={0} value={form.cottageCount} onChange={e => setForm(p => ({ ...p, cottageCount: e.target.value }))} placeholder="5" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Sozlamalar */}
            <div style={sectionStyle}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>⚙️ Sozlamalar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'active', label: "Faol (saytda ko'rinadi)" },
                  { key: 'featured', label: 'Tavsiya etilgan (bosh sahifa)' },
                  { key: 'openYearRound', label: "Yil bo'yi ochiq" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: 14 }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Saqlash */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #0d4a28, #1a6b3c)',
              color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 16,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(26,107,60,0.3)'
            }}>
              {loading ? '⏳ Saqlanmoqda...' : isEdit ? '✅ O\'zgarishlarni saqlash' : '+ Maskan qo\'shish'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
