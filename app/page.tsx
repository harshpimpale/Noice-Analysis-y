'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, MapPin, LineChart, FileSpreadsheet, Upload, ArrowRight, VolumeX, Car, TreeDeciduous, Shield, Megaphone, BookOpen } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import Image from 'next/image'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function Home() {
  const scrollAnimation = useScrollAnimation()

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="space-y-12"
    >
      <motion.div 
        variants={itemVariants} 
        className="relative h-[600px] overflow-hidden"
      >
        <Image
          src="/images/noise-pollution-hero.webp"
          alt="Artistic illustration of urban noise pollution showing construction, traffic, and affected citizens"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex flex-col items-center justify-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center px-4"
          >
            Understanding Noise Pollution in Palghar
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl max-w-2xl mx-auto text-center px-4"
          >
            Explore and analyze the impact of noise pollution on our community's health and well-being
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/map">View Map</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/data">Explore Data</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        ref={scrollAnimation.ref} 
        className={`${scrollAnimation.className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto px-4`}
        variants={pageVariants}
      >
        {[
          { 
            icon: FileSpreadsheet, 
            title: 'Data Analysis', 
            description: 'Access and analyze comprehensive noise pollution measurements',
            href: '/data',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%201-oHvd4iojgSdRRCJGra9hDMITZr97Qa.jpeg'
          },
          { 
            icon: BarChart, 
            title: 'Visual Reports', 
            description: 'Generate detailed reports with interactive visualizations',
            href: '/reports',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image2-8iWqCURRUAMP1Nl3UbFcqVYKptawnT.jpeg'
          },
          { 
            icon: Upload, 
            title: 'Contribute Data', 
            description: 'Help expand our database by uploading your measurements',
            href: '/upload',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%203-vxBFAuVPtq4Yrffo26WZxee9KmUMxe.jpeg'
          },
          {
            icon: LineChart,
            title: 'Forecast',
            description: 'Predict future noise levels and explore potential scenarios',
            href: '/analysis-forecast',
            image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E%202024-12-25%2011.54.21%20-%20A%20futuristic%20visualization%20of%20noise%20pollution%20levels%20in%20an%20urban%20environment,%20featuring%20a%20cityscape%20with%20various%20noise%20sources%20like%20vehicles,%20factorie-mlhS7yj0GBMgSR947ROAGLK95HCzDX.webp'
          }
        ].map((item, index) => (
          <motion.div 
            key={item.title} 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={item.href}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">{item.description}</p>
                  <Button variant="ghost" className="mt-4 w-full group">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="container mx-auto px-4"
      >
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E 2024-12-23 14.40.37 - A detailed and artistic representation of noise pollution in an urban environment. The scene features a busy city street with loud construction work, -p6pv7eomWFBgkX3EtHUEMIMBnhCUGd.webp"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Understanding Noise Pollution</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Sources</h3>
                  <p className="text-white/90">Traffic, construction, industrial activities, and urban development contribute to noise pollution.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Impact</h3>
                  <p className="text-white/90">Affects health, sleep quality, stress levels, and overall quality of life in urban areas.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Solutions</h3>
                  <p className="text-white/90">Monitoring, regulation, urban planning, and community awareness help reduce noise pollution.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="container mx-auto px-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Preventing and Decreasing Noise Pollution</CardTitle>
            <CardDescription>
              Practical steps to reduce noise pollution in our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start space-x-4">
                <VolumeX className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Use Noise-Reducing Materials</h3>
                  <p className="text-sm text-muted-foreground">Install soundproof windows, doors, and use noise-absorbing materials in buildings to reduce external noise.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Car className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Promote Green Transportation</h3>
                  <p className="text-sm text-muted-foreground">Encourage the use of electric vehicles, bicycles, and public transportation to reduce traffic noise.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <TreeDeciduous className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Create Green Barriers</h3>
                  <p className="text-sm text-muted-foreground">Plant trees and create green spaces to act as natural sound barriers in urban areas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Enforce Noise Regulations</h3>
                  <p className="text-sm text-muted-foreground">Support and enforce local noise ordinances to limit noise levels from various sources.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Megaphone className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Raise Awareness</h3>
                  <p className="text-sm text-muted-foreground">Educate the community about the impacts of noise pollution and ways to reduce it in daily life.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BookOpen className="w-8 h-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Implement Quiet Hours</h3>
                  <p className="text-sm text-muted-foreground">Establish and respect quiet hours in residential areas, especially during nighttime.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  )
}

