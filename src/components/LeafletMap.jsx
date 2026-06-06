import { useEffect, useRef } from 'react'

// Leaflet CDN dan yuklanadi — npm package shart emas
export default function LeafletMap({ lat, lon, onSelect }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  const defaultLat = lat ? Number(lat) : 41.2995
  const defaultLon = lon ? Number(lon) : 69.2401

  useEffect(() => {
    // Leaflet CSS va JS ni dinamik yuklaymiz
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeaflet = () => {
      if (window.L) {
        initMap()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L
      const map = L.map(mapRef.current).setView([defaultLat, defaultLon], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      // Marker ikonka
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      // Agar koordinata bo'lsa marker qo'yamiz
      if (lat && lon) {
        markerRef.current = L.marker([Number(lat), Number(lon)], { icon }).addTo(map)
      }

      // Xaritaga bosish — marker o'rnatiladi
      map.on('click', (e) => {
        const { lat: clickLat, lng: clickLon } = e.latlng
        const rounded = {
          lat: clickLat.toFixed(6),
          lon: clickLon.toFixed(6)
        }

        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLon])
        } else {
          markerRef.current = L.marker([clickLat, clickLon], { icon }).addTo(map)
        }

        onSelect(rounded.lat, rounded.lon)
      })

      mapInstanceRef.current = map
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // lat/lon o'zgarganda marker yangilanadi
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return
    if (lat && lon) {
      const L = window.L
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
      if (markerRef.current) {
        markerRef.current.setLatLng([Number(lat), Number(lon)])
      } else {
        markerRef.current = L.marker([Number(lat), Number(lon)], { icon }).addTo(mapInstanceRef.current)
      }
      mapInstanceRef.current.setView([Number(lat), Number(lon)], 14)
    } else if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }, [lat, lon])

  return (
    <div
      ref={mapRef}
      style={{
        height: 280,
        borderRadius: 10,
        border: '1.5px solid #e5e7eb',
        overflow: 'hidden',
        cursor: 'crosshair',
        zIndex: 0
      }}
    />
  )
}
