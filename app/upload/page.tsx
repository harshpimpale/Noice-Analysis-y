"use client"

import { useState, useCallback } from "react"
import { Upload, AlertCircle, CheckCircle2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Papa from "papaparse"
import * as XLSX from "xlsx"

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const validateNoiseData = (data: any[]): data is NoiseDataEntry[] => {
    return data.every(
      (entry) =>
        typeof entry.id === "string" &&
        typeof entry.name === "string" &&
        typeof entry.type === "string" &&
        typeof entry.lat === "number" &&
        typeof entry.lng === "number" &&
        typeof entry.date === "string" &&
        typeof entry.morning === "number" &&
        typeof entry.afternoon === "number" &&
        typeof entry.evening === "number",
    )
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }, [])

  const parseFile = async (file: File): Promise<any[]> => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (fileExtension === "csv") {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          complete: (results) => resolve(results.data),
          header: true,
          error: reject,
        })
      })
    } else if (["xlsx", "xls"].includes(fileExtension || "")) {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      return XLSX.utils.sheet_to_json(sheet)
    } else if (fileExtension === "json") {
      const text = await file.text()
      return JSON.parse(text)
    } else {
      throw new Error("Unsupported file format")
    }
  }

  const handleUpload = useCallback(async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const parsedData = await parseFile(file)

      if (!validateNoiseData(parsedData)) {
        throw new Error('Invalid data format. Please check the template and try again.')
      }

      const existingData: NoiseDataEntry[] = JSON.parse(localStorage.getItem('noiseData') || '[]')
      const newData = [...existingData, ...parsedData]
      localStorage.setItem('noiseData', JSON.stringify(newData))

      setSuccess(true)
      setFile(null)
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      setTimeout(() => {
        router.push('/data')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [file, router, parseFile]); // Added parseFile to dependencies

  const downloadTemplate = useCallback(() => {
    const template = `id,name,type,lat,lng,date,morning,afternoon,evening
example_id,Example Location,Commercial,19.6967,72.7699,2024-01-01,75.5,78.2,82.1`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "noise_data_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }, [])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-cover bg-center bg-fixed relative p-12 rounded-lg overflow-hidden"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-IbuYXR7fRtPtjOgxoQVMu1oPiUP0MV.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Upload Noise Pollution Data</h1>
          <p className="text-white/80 text-xl">
            Contribute to our database by uploading your noise pollution measurements
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Data</CardTitle>
              <CardDescription>Select and upload your CSV file containing noise pollution data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600">Success</AlertTitle>
                  <AlertDescription className="text-green-600">
                    Data uploaded successfully! Your data has been added to the database.
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Data
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Format Guidelines</CardTitle>
              <CardDescription>
                Please follow these guidelines to ensure your data is processed correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="format">
                  <AccordionTrigger>Required Format</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>File format must be CSV, XLSX, XLS, or JSON</li>
                      <li>Required columns: id, name, type, lat, lng, date, morning, afternoon, evening</li>
                      <li>Date format: YYYY-MM-DD</li>
                      <li>Noise levels must be numeric values in dB</li>
                      <li>Coordinates must be valid latitude and longitude values</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tips">
                  <AccordionTrigger>Data Quality Tips</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Ensure all measurements are in decibels (dB)</li>
                      <li>Verify the accuracy of coordinates</li>
                      <li>Use consistent location names</li>
                      <li>Include the correct zone type (Commercial, Residential, etc.)</li>
                      <li>Double-check all values before uploading</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Processing</CardTitle>
            <CardDescription>Understanding how your data is handled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border bg-card text-card-foreground">
                <h3 className="font-semibold mb-2">1. Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is automatically validated to ensure it meets the required format and quality standards.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card text-card-foreground">
                <h3 className="font-semibold mb-2">2. Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Valid data is processed and integrated with existing measurements in the database.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card text-card-foreground">
                <h3 className="font-semibold mb-2">3. Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  Your data becomes immediately available in the map and analysis tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

