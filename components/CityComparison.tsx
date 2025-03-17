import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchStationMonthData, fetchStationInfoData, type StationMonth, type StationInfo } from "@/utils/fetchCsvData"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface CityData {
  city: string
  avgDay: number
  avgNight: number
  dayLimit: number
  nightLimit: number
}

const CityComparison: React.FC = () => {
  const [stationMonthData, setStationMonthData] = useState<StationMonth[]>([])
  const [stationInfoData, setStationInfoData] = useState<StationInfo[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(2018)
  const [cityData, setCityData] = useState<CityData[]>([])
  const [city1, setCity1] = useState<string>("")
  const [city2, setCity2] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      const monthData = await fetchStationMonthData()
      const infoData = await fetchStationInfoData()
      setStationMonthData(monthData)
      setStationInfoData(infoData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (stationMonthData.length > 0 && stationInfoData.length > 0) {
      const cityDataMap: { [key: string]: CityData } = {}

      stationMonthData.forEach((station) => {
        if (station.Year === selectedYear) {
          const stationInfo = stationInfoData.find((info) => info.Station === station.Station)
          if (
            stationInfo &&
            (selectedCities.includes(stationInfo.City) || stationInfo.City === city1 || stationInfo.City === city2)
          ) {
            if (!cityDataMap[stationInfo.City]) {
              cityDataMap[stationInfo.City] = {
                city: stationInfo.City,
                avgDay: 0,
                avgNight: 0,
                dayLimit: station.DayLimit,
                nightLimit: station.NightLimit,
                count: 0,
              }
            }
            cityDataMap[stationInfo.City].avgDay += station.Day
            cityDataMap[stationInfo.City].avgNight += station.Night
            cityDataMap[stationInfo.City].count++
          }
        }
      })

      const processedCityData = Object.values(cityDataMap).map((city) => ({
        ...city,
        avgDay: city.avgDay / city.count,
        avgNight: city.avgNight / city.count,
      }))

      setCityData(processedCityData)
    }
  }, [stationMonthData, stationInfoData, selectedCities, selectedYear, city1, city2])

  const availableCities = Array.from(new Set(stationInfoData.map((station) => station.City)))
  const availableYears = Array.from(new Set(stationMonthData.map((station) => station.Year)))

  const twoCityComparisonData = cityData.filter((city) => city.city === city1 || city.city === city2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>City Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="multiple">
          <TabsList>
            <TabsTrigger value="multiple">Multiple Cities</TabsTrigger>
            <TabsTrigger value="two">Two Cities</TabsTrigger>
          </TabsList>
          <TabsContent value="multiple">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Select onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setSelectedCities((prev) => [...prev, value])}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add City" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgDay" name="Avg Day Noise" fill="#8884d8" />
                    <Bar dataKey="avgNight" name="Avg Night Noise" fill="#82ca9d" />
                    <Bar dataKey="dayLimit" name="Day Limit" fill="#ffc658" />
                    <Bar dataKey="nightLimit" name="Night Limit" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="two">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Select onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setCity1}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select City 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setCity2}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select City 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={twoCityComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgDay" name="Avg Day Noise" stroke="#8884d8" />
                    <Line type="monotone" dataKey="avgNight" name="Avg Night Noise" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="dayLimit" name="Day Limit" stroke="#ffc658" />
                    <Line type="monotone" dataKey="nightLimit" name="Night Limit" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default CityComparison

