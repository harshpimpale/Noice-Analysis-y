"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { noiseData } from "../data/noiseData"
import NoiseChart from "@/components/NoiseChart"
import NoiseMap from "@/components/NoiseMap"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function ReportsPage() {
  const [reportData, setReportData] = useState({
    location: "",
    startDate: "",
    endDate: "",
  })
  const [showReport, setShowReport] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setReportData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setReportData((prev) => ({ ...prev, location: value }))
  }

  const generateReport = () => {
    setShowReport(true)
  }

  const locations = Array.from(new Set(noiseData.map((item) => item.name)))

  const filteredData = noiseData.filter(
    (item) =>
      item.name === reportData.location &&
      new Date(item.date) >= new Date(reportData.startDate) &&
      new Date(item.date) <= new Date(reportData.endDate),
  )

  const averageNoise =
    filteredData.reduce((acc, item) => acc + (item.morning + item.afternoon + item.evening) / 3, 0) /
    filteredData.length

  const downloadPDF = async () => {
    const report = document.getElementById("report-content")
    if (!report) return

    const canvas = await html2canvas(report)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 30

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`noise-pollution-report-${reportData.location}.pdf`)
  }

  return (
    <div className="space-y-8">
      <div className="bg-industrial bg-cover bg-center bg-overlay relative p-8 rounded-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Noise Pollution Report Generator</h1>
          <p className="text-white/80 mt-2">Generate comprehensive reports based on collected noise pollution data.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Customize your report by selecting a location and date range.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select onValueChange={handleLocationChange} value={reportData.location}>
              <SelectTrigger id="location">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={reportData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" value={reportData.endDate} onChange={handleInputChange} />
          </div>
          <Button onClick={generateReport}>Generate Report</Button>
        </CardContent>
      </Card>

      {showReport && (
        <div className="space-y-8">
          <div id="report-content" className="space-y-8 bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold">Noise Pollution Report</h2>

            <section>
              <h3 className="text-xl font-semibold">1. Overview of Noise Pollution</h3>
              <p>
                Noise pollution is the propagation of noise with harmful impact on the activity of human or animal life.
                The main sources include transportation, industrial machinery, and recreational activities. Prolonged
                exposure to high levels of noise can lead to various health issues, including hearing loss, sleep
                disturbance, and increased stress levels.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold">2. Data Analysis</h3>
              <p>
                This report analyzes noise pollution data for {reportData.location} from {reportData.startDate} to{" "}
                {reportData.endDate}. The average noise level during this period was {averageNoise.toFixed(2)} dB.
              </p>
              <div className="h-[400px] mt-4">
                <NoiseChart data={filteredData} location={reportData.location} analysisType="time" threshold={70} />
              </div>
              <div className="h-[400px] mt-4">
                <NoiseMap data={filteredData} threshold={70} />
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">3. Impacts</h3>
              <p>
                The recorded noise levels in {reportData.location} have potential impacts on human health and the
                environment:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Levels above 70 dB can lead to hearing damage over prolonged periods.</li>
                <li>Consistent noise above 50 dB can disturb sleep patterns and increase stress levels.</li>
                <li>Wildlife in the area may experience behavioral changes and habitat disruption.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold">4. Regulations and Recommendations</h3>
              <p>
                While specific local regulations may vary, the World Health Organization recommends that environmental
                noise levels should not exceed 45 dB at night to prevent adverse health effects.
              </p>
              <p className="mt-2">Based on the data collected, we recommend:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Implementing noise barriers in high-traffic areas</li>
                <li>Enforcing stricter regulations on industrial noise emissions</li>
                <li>Promoting the use of noise-reducing materials in construction</li>
                <li>Educating the public about the impacts of noise pollution and ways to reduce it</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold">5. Conclusion</h3>
              <p>
                The noise pollution levels in {reportData.location} during the analyzed period show significant
                variations, with an average level of {averageNoise.toFixed(2)} dB. This level indicates a need for
                targeted interventions to reduce noise pollution and mitigate its impacts on health and the environment.
                By implementing the recommended measures and continuing to monitor noise levels, we can work towards
                creating a healthier and more peaceful environment for all residents.
              </p>
            </section>
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={() => window.print()} className="print:hidden">
              Print Report
            </Button>
            <Button onClick={downloadPDF} className="print:hidden">
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

