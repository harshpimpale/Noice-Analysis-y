import type React from "react"
import "./globals.css"
import { Inter, Lora } from "next/font/google"
import Link from "next/link"
import { ThemeProvider } from "@/components/ThemeProvider"
import config from "@/config"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" })

export const metadata = {
  title: "Palghar Noise Pollution Analysis",
  description: "Analyze and visualize noise pollution data in Palghar",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider>
          <header className="bg-primary text-primary-foreground p-4 shadow-md">
            <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
              <Link href="/" className="text-2xl font-bold mb-4 sm:mb-0">
                Palghar Noise Analysis
              </Link>
              <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
                <li>
                  <Link href="/data" className="hover:text-secondary transition-colors">
                    Data
                  </Link>
                </li>
                <li>
                  <Link href="/analysis" className="hover:text-secondary transition-colors">
                    Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/analysis-forecast" className="hover:text-secondary transition-colors">
                    Forecast
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-secondary transition-colors">
                    Map
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-secondary transition-colors">
                    Reports
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-secondary transition-colors">
                    Upload Data
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="container mx-auto mt-8 px-4 pb-8">{children}</main>
          <footer
            className="bg-primary mt-8 py-8 text-center text-primary-foreground bg-cover bg-center bg-blend-overlay"
            style={{ backgroundImage: "url('/images/footer-background.jpeg')" }}
          >
            <div className="container mx-auto">
              <p className="text-lg font-semibold mb-2">&copy; 2025 Palghar Noise Pollution Analysis</p>
              <p className="text-sm opacity-75">Dedicated to creating a quieter, healthier environment for all</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'