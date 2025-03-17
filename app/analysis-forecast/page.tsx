"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { YearSlider } from "@/components/YearSlider"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { AlertCircle, ThumbsUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  historicalNoiseData,
  getHistoricalData,
  getLocationData,
  predictFutureNoise,
} from "@/app/data/historicalNoiseData"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
}

export default function AnalysisForecastPage() {
  const [yearRange, setYearRange] = useState([2000, 2024])
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["Kuber Complex", "Railway Station"])
  const [urbanGrowth, setUrbanGrowth] = useState(50)
  const [trafficDensity, setTrafficDensity] = useState(50)
  const [industrialActivity, setIndustrialActivity] = useState(50)
  const [greenSpaces, setGreenSpaces] = useState(50)
  const [noisePolicies, setNoisePolicies] = useState(50)
  const [userFeedback, setUserFeedback] = useState("")
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [forecastData, setForecastData] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState("comparison")

  const allLocations = Array.from(new Set(historicalNoiseData.flatMap((year) => year.locations.map((loc) => loc.name))))

  useEffect(() => {
    const allLocationData = selectedLocations.map((location) => {
      return getLocationData(location).filter((data) => data.year >= yearRange[0] && data.year <= yearRange[1])
    })
    setHistoricalData(allLocationData)

    const futurePredictions = selectedLocations.map((location) =>
      Array.from({ length: 21 }, (_, i) => 2025 + i).map((year) => ({
        year,
        [location]: predictFutureNoise(
          location,
          year,
          urbanGrowth,
          trafficDensity,
          industrialActivity,
          greenSpaces,
          noisePolicies,
        ),
      })),
    )
    setForecastData(futurePredictions[0])
  }, [selectedLocations, yearRange, urbanGrowth, trafficDensity, industrialActivity, greenSpaces, noisePolicies])

  const handleYearRangeChange = (newRange: number[]) => {
    setYearRange(newRange)
  }

  const handleLocationChange = (location: string, isChecked: boolean) => {
    setSelectedLocations((prev) => {
      if (isChecked) {
        return [...prev, location]
      } else {
        return prev.filter((loc) => loc !== location)
      }
    })
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Noise Pollution Analysis and Forecasting</h1>
        <p className="text-xl">
          Explore historical trends, predict future levels, and discover ways to reduce noise pollution in Palghar.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
          <TabsTrigger value="comparison">Historical Comparison</TabsTrigger>
          <TabsTrigger value="prediction">Future Prediction</TabsTrigger>
          <TabsTrigger value="measures">Remedial Measures</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="locations">Select Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Comparison of Noise Pollution Over the Years</CardTitle>
              <CardDescription>
                Adjust the slider to view noise pollution levels for different years and locations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Year Range: {yearRange[0]} - {yearRange[1]}
                </Label>
                <YearSlider
                  min={2000}
                  max={2045}
                  step={1}
                  value={yearRange}
                  onValueChange={handleYearRangeChange}
                  className="w-full"
                />
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" allowDuplicatedCategory={false} />
                    <YAxis label={{ value: "Noise Level (dB)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    {historicalData.map((locationData, index) => (
                      <Line
                        key={`line-${selectedLocations[index]}`}
                        data={locationData}
                        type="monotone"
                        dataKey="averageNoise"
                        name={selectedLocations[index]}
                        stroke={`hsl(${(index * 360) / selectedLocations.length}, 70%, 50%)`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction">
          <Card>
            <CardHeader>
              <CardTitle>Future Noise Pollution Prediction (2025-2045)</CardTitle>
              <CardDescription>
                Adjust variables to simulate future noise pollution levels in selected locations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Urban Growth</Label>
                <Slider value={[urbanGrowth]} onValueChange={(value) => setUrbanGrowth(value[0])} max={100} step={1} />
                <p className="text-sm text-muted-foreground">Current: {urbanGrowth}%</p>
              </div>
              <div className="space-y-2">
                <Label>Traffic Density</Label>
                <Slider
                  value={[trafficDensity]}
                  onValueChange={(value) => setTrafficDensity(value[0])}
                  max={100}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">Current: {trafficDensity}%</p>
              </div>
              <div className="space-y-2">
                <Label>Industrial Activity</Label>
                <Slider
                  value={[industrialActivity]}
                  onValueChange={(value) => setIndustrialActivity(value[0])}
                  max={100}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">Current: {industrialActivity}%</p>
              </div>
              <div className="space-y-2">
                <Label>Green Spaces</Label>
                <Slider value={[greenSpaces]} onValueChange={(value) => setGreenSpaces(value[0])} max={100} step={1} />
                <p className="text-sm text-muted-foreground">Current: {greenSpaces}%</p>
              </div>
              <div className="space-y-2">
                <Label>Noise Reduction Policies</Label>
                <Slider
                  value={[noisePolicies]}
                  onValueChange={(value) => setNoisePolicies(value[0])}
                  max={100}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">Current: {noisePolicies}%</p>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: "Predicted Noise Level (dB)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    {selectedLocations.map((location, index) => (
                      <Area
                        key={`area-${location}`}
                        type="monotone"
                        dataKey={location}
                        name={location}
                        fill={`hsl(${(index * 360) / selectedLocations.length}, 70%, 50%)`}
                        stroke={`hsl(${(index * 360) / selectedLocations.length}, 70%, 50%)`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measures">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions and Remedial Measures</CardTitle>
              <CardDescription>Actionable steps to reduce noise pollution in Palghar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">For Residential Areas:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Install soundproof windows and doors</li>
                    <li>Plant trees and create green barriers</li>
                    <li>Implement and respect quiet hours</li>
                    <li>Use noise-absorbing materials in home construction</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">For Commercial Areas:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use noise-absorbing materials in construction</li>
                    <li>Regulate delivery times to reduce nighttime noise</li>
                    <li>Encourage the use of electric vehicles for deliveries</li>
                    <li>Install sound barriers around noisy equipment</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">For Industrial Areas:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Install noise barriers around industrial sites</li>
                    <li>Use quieter machinery and equipment</li>
                    <li>Implement regular maintenance to reduce equipment noise</li>
                    <li>Create buffer zones between industrial and residential areas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">General Measures:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Enforce stricter noise regulations</li>
                    <li>Promote public awareness about noise pollution</li>
                    <li>Invest in smart city technologies for noise monitoring</li>
                    <li>Encourage the use of public transportation</li>
                  </ul>
                </div>
              </div>
              <Alert className="bg-green-50 border-green-200">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success Story</AlertTitle>
                <AlertDescription className="text-green-700">
                  The city of Mumbai has successfully reduced noise pollution in some areas by up to 8 dB by
                  implementing low-noise road surfaces, creating quiet zones, and promoting electric public
                  transportation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>Share your thoughts or report noise concerns in Palghar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Type your feedback or concerns here..."
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  // Here you would typically send the feedback to a server
                  alert(
                    "Thank you for your feedback! We will use this information to improve our noise pollution mitigation efforts in Palghar.",
                  )
                  setUserFeedback("")
                }}
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Select Locations</CardTitle>
              <CardDescription>Choose the locations you want to analyze and compare.</CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {allLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={location}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                    />
                    <label
                      htmlFor={location}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

