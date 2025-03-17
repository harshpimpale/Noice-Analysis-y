'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

interface MapProps {
  data: Array<{
    id: number
    name: string
    type: string
    lat: number
    lng: number
    date: string
    morning: number
    afternoon: number
    evening: number
  }>
  onMarkerClick: (place: MapProps['data'][0]) => void
  searchTerm: string
}

const Map: React.FC<MapProps> = ({ data, onMarkerClick, searchTerm }) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [19.7515, 72.8],
        zoom: 11,
        zoomControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current)

      L.control.zoom({
        position: 'topright'
      }).addTo(mapRef.current)

      markersRef.current = L.markerClusterGroup()
      mapRef.current.addLayer(markersRef.current)
    }

    if (markersRef.current) {
      markersRef.current.clearLayers()

      data.forEach(place => {
        if (place.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            place.type.toLowerCase().includes(searchTerm.toLowerCase())) {
          const markerColor = getMarkerColor(place.type)
          const avgNoise = ((place.morning + place.afternoon + place.evening) / 3).toFixed(1)
          
          const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
              background-color: ${markerColor}; 
              width: ${place.type === 'High Noise Pollution Area' ? '16px' : '12px'}; 
              height: ${place.type === 'High Noise Pollution Area' ? '16px' : '12px'}; 
              border-radius: 50%; 
              border: 2px solid white; 
              box-shadow: 0 0 4px rgba(0,0,0,0.4);
              ${place.type === 'High Noise Pollution Area' ? 'animation: pulse 1.5s infinite;' : ''}
            "></div>`,
            iconSize: [place.type === 'High Noise Pollution Area' ? 16 : 12, place.type === 'High Noise Pollution Area' ? 16 : 12],
            iconAnchor: [place.type === 'High Noise Pollution Area' ? 8 : 6, place.type === 'High Noise Pollution Area' ? 8 : 6]
          })

          const marker = L.marker([place.lat, place.lng], { icon: markerIcon })
            .bindPopup(`
              <strong>${place.name}</strong><br>
              Type: ${place.type}<br>
              Avg. Noise: ${avgNoise} dB
            `)
            .on('click', () => {
              onMarkerClick(place)
            })

          markersRef.current?.addLayer(marker)
        }
      })
    }
  }, [data, onMarkerClick, searchTerm])

  return <div id="map" style={{ height: '100%', width: '100%' }} />
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'Commercial':
      return '#eab308' // yellow
    case 'Silent Area':
      return '#3b82f6' // blue
    case 'Industrial':
      return '#f97316' // orange
    case 'Residential':
      return '#22c55e' // green
    case 'High Noise Pollution Area':
      return '#ef4444' // red
    default:
      return '#3b82f6' // default blue
  }
}

export default Map

