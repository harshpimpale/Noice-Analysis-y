import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NoiseData {
  srNo: number
  place: string
  zoneType: string
  [key: string]: number | string
}

interface NoiseDataTableProps {
  data: NoiseData[]
}

export default function NoiseDataTable({ data }: NoiseDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = data.filter(item =>
    item.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.zoneType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <Input
        type="text"
        placeholder="Search by place or zone type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Zone Type</TableHead>
              <TableHead>18-10-2024 (7:30-9:30)</TableHead>
              <TableHead>18-10-2024 (12:30-2:30)</TableHead>
              <TableHead>18-10-2024 (6:30-8:30)</TableHead>
              {/* Add more table headers for other dates and times */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.srNo}>
                <TableCell>{item.srNo}</TableCell>
                <TableCell>{item.place}</TableCell>
                <TableCell>{item.zoneType}</TableCell>
                <TableCell>{item['18-10-2024 (7:30-9:30)']}</TableCell>
                <TableCell>{item['18-10-2024 (12:30-2:30)']}</TableCell>
                <TableCell>{item['18-10-2024 (6:30-8:30)']}</TableCell>
                {/* Add more table cells for other dates and times */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {pageCount}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

