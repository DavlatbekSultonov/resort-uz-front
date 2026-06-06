import AdminLayout from '../../components/AdminLayout'
import { useNavigate } from 'react-router-dom'

const REGIONS = [
  { id: 1, name: 'Toshkent viloyati' },
  { id: 2, name: 'Toshkent shahar' },
  { id: 3, name: 'Andijon' },
  { id: 4, name: 'Farg\'ona' },
  { id: 5, name: 'Namangan' },
  { id: 6, name: 'Samarqand' },
  { id: 7, name: 'Buxoro' },
  { id: 8, name: 'Navoiy' },
  { id: 9, name: 'Qashqadaryo' },
  { id: 10, name: 'Surxondaryo' },
  { id: 11, name: 'Jizzax' },
  { id: 12, name: 'Sirdaryo' },
  { id: 13, name: 'Xorazm' },
  { id: 14, name: 'Qoraqalpog\'iston' },
]

export default function RegionsPage() {
  const navigate = useNavigate()

  return (
    <AdminLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>🗺️ Viloyatlar</h1>
        <p style={{ color: 'var(--text-light)' }}>O'zbekiston viloyatlari</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {REGIONS.map(r => (
          <div key={r.id} style={{
            background: '#fff', borderRadius: 14, padding: 20,
            boxShadow: 'var(--shadow)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🗺️ {r.name}</div>
            </div>
            <button
              onClick={() => navigate(`/maskanlar?regionId=${r.id}`)}
              style={{
                padding: '7px 14px', borderRadius: 8,
                border: '1.5px solid var(--primary)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>
              Ko'rish →
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}