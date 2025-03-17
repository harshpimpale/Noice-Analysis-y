import type React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface NoiseDataPoint {
  date: string
  morning: number
  afternoon: number
  evening: number
}

interface InteractiveNoiseChartProps {
  data: NoiseDataPoint[]
  location: string
}

const InteractiveNoiseChart: React.FC<InteractiveNoiseChartProps> = ({ data, location }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Morning",
        data: data.map((item) => item.morning),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Afternoon",
        data: data.map((item) => item.afternoon),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Evening",
        data: data.map((item) => item.evening),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Noise Levels in ${location}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Noise Level (dB)",
        },
      },
    },
  }

  return <Line options={options} data={chartData} />
}

export default InteractiveNoiseChart

