import { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'

interface NoiseChartProps {
  data: any[]
  location: string
  analysisType: 'time' | 'distribution'
  threshold: number
}

export default function NoiseChart({ data, location, analysisType, threshold }: NoiseChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(item => item.name === location)
      .map(item => ({
        date: item.date,
        morning: item.morning,
        afternoon: item.afternoon,
        evening: item.evening,
        average: (item.morning + item.afternoon + item.evening) / 3
      }))
  }, [data, location])

  const distributionData = useMemo(() => {
    const bins = Array.from({ length: 12 }, (_, i) => i * 10)
    return bins.map(bin => ({
      range: `${bin}-${bin + 10}`,
      count: chartData.filter(item => item.average >= bin && item.average < bin + 10).length
    }))
  }, [chartData])

  if (analysisType === 'time') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Noise Level (dB)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="morning" name="Morning" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="afternoon" name="Afternoon" stroke="#82ca9d" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="evening" name="Evening" stroke="#ffc658" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="average" name="Daily Average" stroke="#ff7300" activeDot={{ r: 8 }} />
          <Line y={threshold} stroke="red" strokeDasharray="5 5" name="Threshold" />
        </LineChart>
      </ResponsiveContainer>
    )
  } else {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={distributionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis label={{ value: 'Number of Days', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Days in Range" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

