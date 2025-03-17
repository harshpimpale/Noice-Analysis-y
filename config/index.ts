// config/index.ts
export interface Config {
  api: {
    baseUrl: string
  }
  map: {
    center: [number, number]
    zoom: number
  }
}

export const loadConfig = (): Config => {
  return {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    },
    map: {
      center: [19.6967, 72.7699], // Default center for Palghar
      zoom: 11,
    },
  }
}

export default loadConfig()

