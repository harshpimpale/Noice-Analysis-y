import Papa from "papaparse"

export interface StationMonth {
  Station: string
  Year: number
  Month: number
  Day: number
  Night: number
  DayLimit: number
  NightLimit: number
}

export interface StationInfo {
  Station: string
  Name: string
  City: string
  State: string
  Type: string
}

export async function fetchCsvData<T>(url: string): Promise<T[]> {
  const response = await fetch(url)
  const csvText = await response.text()
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        resolve(results.data as T[])
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export async function fetchStationMonthData(): Promise<StationMonth[]> {
  const data = await fetchCsvData<StationMonth>(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/station_month-cKkiBjygcBGuMpUFscc1HzjzRyJdnQ.csv",
  )
  return data.map((item) => ({
    ...item,
    Year: Number.parseInt(item.Year as unknown as string),
    Month: Number.parseInt(item.Month as unknown as string),
    Day: Number.parseFloat(item.Day as unknown as string),
    Night: Number.parseFloat(item.Night as unknown as string),
    DayLimit: Number.parseFloat(item.DayLimit as unknown as string),
    NightLimit: Number.parseFloat(item.NightLimit as unknown as string),
  }))
}

export async function fetchStationInfoData(): Promise<StationInfo[]> {
  return await fetchCsvData<StationInfo>(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stations-8E7CcSNYZkfaunhj69PmV1lpdkyYwW.csv",
  )
}

