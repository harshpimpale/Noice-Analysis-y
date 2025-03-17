"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { noiseData } from "../data/noiseData"

const MapWithNoSSR = dynamic(() => import("@/components/NoiseMap"), {
  ssr: false,
})

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<(typeof noiseData)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [noiseThreshold, setNoiseThreshold] = useState(70)

  const filteredData = noiseData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-industrial bg-cover bg-center bg-overlay relative p-8 rounded-lg">
        <div className="relative z-10">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white"
          >
            Noise Pollution Map of Palghar
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 mt-2"
          >
            This map visualizes noise pollution levels across various locations in Palghar. Markers are color-coded
            based on noise levels, with red indicating high noise pollution areas.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="h-[600px] w-full rounded-lg shadow-md border overflow-hidden"
          >
            <MapWithNoSSR data={filteredData} threshold={noiseThreshold} onMarkerClick={setSelectedPlace} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            {selectedPlace ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlace.name}</CardTitle>
                  <CardDescription>{selectedPlace.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Noise Levels (dB)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Morning:</span>
                        <span className={selectedPlace.morning > noiseThreshold ? "text-red-500 font-bold" : ""}>
                          {selectedPlace.morning}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Afternoon:</span>
                        <span className={selectedPlace.afternoon > noiseThreshold ? "text-red-500 font-bold" : ""}>
                          {selectedPlace.afternoon}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Evening:</span>
                        <span className={selectedPlace.evening > noiseThreshold ? "text-red-500 font-bold" : ""}>
                          {selectedPlace.evening}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Date</h3>
                    <p>{selectedPlace.date}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                  <CardDescription>Select a location on the map to view its details</CardDescription>
                </CardHeader>
              </Card>
            )}
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>Map Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Below Threshold ({noiseThreshold} dB)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Above Threshold ({noiseThreshold} dB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

