'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { noiseData } from '@/app/data/noiseData'

interface NoiseDataEntry {
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

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [combinedData, setCombinedData] = useState<NoiseDataEntry[]>(noiseData)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = () => {
      try {
        const uploadedData = JSON.parse(localStorage.getItem('noiseData') || '[]') as NoiseDataEntry[]
        setCombinedData([...noiseData, ...uploadedData])
      } catch (error) {
        console.error('Error parsing uploaded data:', error)
        setCombinedData(noiseData)
      }
    }

    fetchData()
  }, [])

  const uniqueTypes = useMemo(() => {
    return ['all', ...Array.from(new Set(combinedData.map(item => item.type)))]
  }, [combinedData])

  const filteredData = useMemo(() => {
    return combinedData.filter(item =>
      (selectedType === 'all' || item.type === selectedType) &&
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, selectedType, combinedData])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const pageCount = Math.ceil(filteredData.length / itemsPerPage)

  const downloadData = () => {
    const headers = ['ID', 'Name', 'Type', 'Latitude', 'Longitude', 'Date', 'Morning', 'Afternoon', 'Evening']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        item.name,
        item.type,
        item.lat,
        item.lng,
        item.date,
        item.morning,
        item.afternoon,
        item.evening
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'noise_pollution_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-traffic bg-cover bg-center bg-overlay relative p-8 rounded-lg">
        <div className="relative z-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white"
          >
            Noise Pollution Data
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 mt-2"
          >
            Comprehensive data collection from various locations in Palghar
          </motion.p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={downloadData} className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <motion.div 
            className="overflow-x-auto"
            variants={tableVariants}
            initial="hidden"
            animate="show"
          >
            <Table>
              <TableCaption>A comprehensive list of noise pollution measurements</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Morning (7:30-9:30)</TableHead>
                  <TableHead>Afternoon (12:30-2:30)</TableHead>
                  <TableHead>Evening (6:30-8:30)</TableHead>
                  <TableHead>Average (dB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => {
                  const avgNoise = ((item.morning + item.afternoon + item.evening) / 3).toFixed(1)
                  return (
                    <motion.tr
                      key={item.id}
                      variants={rowVariants}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.morning}</TableCell>
                      <TableCell>{item.afternoon}</TableCell>
                      <TableCell>{item.evening}</TableCell>
                      <TableCell className={Number(avgNoise) > 70 ? 'text-red-500 font-bold' : ''}>
                        {avgNoise}
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          </motion.div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

