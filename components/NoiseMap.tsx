import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { noiseData } from "@/app/data/noiseData"
import config from "@/config"

interface NoiseDataItem {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  date: string
  morning: number
  afternoon: number
  evening: number
}

interface NoiseMapProps {
  data?: NoiseDataItem[]
  threshold: number
  onMarkerClick?: (place: NoiseDataItem) => void
  selectedPlace?: string
}

const isValidCoordinate = (lat: number | undefined, lng: number | undefined) => {
  return typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)
}

export default function NoiseMap({ data = noiseData, threshold, onMarkerClick, selectedPlace }: NoiseMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(data[0]?.date || "")
  const markersRef = useRef<{ [key: string]: L.CircleMarker }>({})

  useEffect(() => {
    if (!config || !config.map) {
      console.error("Map configuration is missing")
      return
    }

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(config.map.center, config.map.zoom)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker)
    })
    markersRef.current = {}

    // Filter data for the selected date
    const filteredData = data.filter((item) => item.date === selectedDate)

    // Add new markers
    filteredData.forEach((item) => {
      if (item.lat !== undefined && item.lng !== undefined && isValidCoordinate(item.lat, item.lng)) {
        const avgNoise = (item.morning + item.afternoon + item.evening) / 3
        const color = avgNoise > threshold ? "red" : "green"
        const isSelected = item.name === selectedPlace
        const marker = L.circleMarker([item.lat, item.lng], {
          radius: isSelected ? 12 : 8,
          fillColor: isSelected ? "yellow" : color,
          color: isSelected ? "black" : "#000",
          weight: isSelected ? 3 : 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map)

        marker.bindPopup(`
          <strong>${item.name}</strong><br>
          Type: ${item.type}<br>
          Date: ${item.date}<br>
          Morning: ${item.morning} dB<br>
          Afternoon: ${item.afternoon} dB<br>
          Evening: ${item.evening} dB<br>
          Avg. Noise: ${avgNoise.toFixed(2)} dB
        `)

        marker.on("click", () => {
          if (onMarkerClick) {
            onMarkerClick(item)
          }
        })

        markersRef.current[item.id] = marker
      } else {
        console.warn(`Invalid or missing coordinates for ${item.name}: (${item.lat}, ${item.lng})`)
      }
    })

    // Fit the map to the markers
    const markers = Object.values(markersRef.current)
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    // Center on selected place if it exists
    if (selectedPlace) {
      const selectedMarker = markers.find((marker) => marker.getPopup()?.getContent().includes(selectedPlace))
      if (selectedMarker) {
        map.setView(selectedMarker.getLatLng(), 13)
      }
    }
  }, [data, threshold, onMarkerClick, selectedDate, selectedPlace])

  const uniqueDates = Array.from(new Set(data.map((item) => item.date))).sort()

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Date:
        </label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div id="map" className="flex-grow">
        {data.length === 0 && (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            No data available for the selected criteria
          </div>
        )}
      </div>
    </div>
  )
}

