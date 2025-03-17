"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import { noiseData } from "../data/noiseData"
import dynamic from "next/dynamic"
import InteractiveNoiseChart from "@/components/InteractiveNoiseChart"
import CityComparison from "@/components/CityComparison"

const NoiseMap = dynamic(() => import("@/components/NoiseMap"), { ssr: false })

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
}

export default function AnalysisPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>(noiseData[0]?.name || "")
  const [startDate, setStartDate] = useState<string>(noiseData[0]?.date || "")
  const [endDate, setEndDate] = useState<string>(noiseData[noiseData.length - 1]?.date || "")
  const [noiseThreshold, setNoiseThreshold] = useState<number>(70)
  const [mapData, setMapData] = useState(noiseData)

  const locations = Array.from(new Set(noiseData.map((item) => item.name)))

  useEffect(() => {
    const filteredData = noiseData.filter(
      (item) =>
        item.name === selectedLocation &&
        new Date(item.date) >= new Date(startDate) &&
        new Date(item.date) <= new Date(endDate),
    )
    setMapData(filteredData)
  }, [selectedLocation, startDate, endDate])

  const handleThresholdChange = (value: number[]) => {
    setNoiseThreshold(value[0])
    const newMapData = noiseData.map((item) => ({
      ...item,
      isAboveThreshold: (item.morning + item.afternoon + item.evening) / 3 > value[0],
    }))
    setMapData(newMapData)
  }

  const downloadData = () => {
    const headers = ["Location", "Type", "Date", "Morning", "Afternoon", "Evening", "Average"]
    const csvData = [
      headers.join(","),
      ...mapData.map((item) => {
        const avg = ((item.morning + item.afternoon + item.evening) / 3).toFixed(1)
        return [item.name, item.type, item.date, item.morning, item.afternoon, item.evening, avg].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `noise-analysis-${selectedLocation}-${startDate}-${endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const analysisResults = useMemo(() => {
    const avgNoise =
      mapData.reduce((acc, item) => acc + (item.morning + item.afternoon + item.evening) / 3, 0) / mapData.length
    const maxNoise = Math.max(...mapData.map((item) => Math.max(item.morning, item.afternoon, item.evening)))
    const minNoise = Math.min(...mapData.map((item) => Math.min(item.morning, item.afternoon, item.evening)))
    const exceedanceCount = mapData.filter(
      (item) => (item.morning + item.afternoon + item.evening) / 3 > noiseThreshold,
    ).length
    const exceedancePercentage = (exceedanceCount / mapData.length) * 100

    const timeOfDayAnalysis = {
      morning: mapData.reduce((acc, item) => acc + item.morning, 0) / mapData.length,
      afternoon: mapData.reduce((acc, item) => acc + item.afternoon, 0) / mapData.length,
      evening: mapData.reduce((acc, item) => acc + item.evening, 0) / mapData.length,
    }

    return {
      avgNoise,
      maxNoise,
      minNoise,
      exceedanceCount,
      exceedancePercentage,
      timeOfDayAnalysis,
    }
  }, [mapData, noiseThreshold])

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-city-contrast bg-cover bg-center bg-overlay relative p-8 rounded-lg mb-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white">Noise Pollution Analysis</h1>
          <p className="text-white/80 mt-2">Analyze and visualize noise pollution data across different locations</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="noise-threshold" className="text-sm font-medium">
              Noise Threshold: {noiseThreshold} dB
            </label>
            <Slider
              id="noise-threshold"
              min={0}
              max={120}
              step={1}
              value={[noiseThreshold]}
              onValueChange={handleThresholdChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-4">
        <Button onClick={downloadData} className="gap-2">
          <Download className="h-4 w-4" />
          Download Analysis Data
        </Button>
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Chart Analysis</TabsTrigger>
          <TabsTrigger value="map">Map Analysis</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="comparison">City Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Noise Level Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InteractiveNoiseChart data={mapData} location={selectedLocation} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Noise Pollution Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <NoiseMap data={mapData} threshold={noiseThreshold} selectedPlace={selectedLocation} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Noise Statistics for {selectedLocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Average Noise Level: {analysisResults.avgNoise.toFixed(2)} dB</p>
                <p>Maximum Noise Level: {analysisResults.maxNoise.toFixed(2)} dB</p>
                <p>Minimum Noise Level: {analysisResults.minNoise.toFixed(2)} dB</p>
                <p>
                  Threshold Exceedance: {analysisResults.exceedanceCount} times (
                  {analysisResults.exceedancePercentage.toFixed(2)}%)
                </p>
                <h4 className="font-semibold mt-4">Average Noise by Time of Day:</h4>
                <p>Morning: {analysisResults.timeOfDayAnalysis.morning.toFixed(2)} dB</p>
                <p>Afternoon: {analysisResults.timeOfDayAnalysis.afternoon.toFixed(2)} dB</p>
                <p>Evening: {analysisResults.timeOfDayAnalysis.evening.toFixed(2)} dB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison">
          <CityComparison />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

