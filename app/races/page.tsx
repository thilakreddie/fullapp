"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Flag } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Race {
  id: string
  name: string
  circuit: string
  date: string
  country: string
}

interface Driver {
  id: string
  name: string
  number: string
  team: string
}

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [racesResponse, driversResponse] = await Promise.all([
          fetch('http://localhost:8081/races'),
          fetch('http://localhost:8081/drivers')
        ])
        const racesData = await racesResponse.json()
        const driversData = await driversResponse.json()
        setRaces(racesData)
        setDrivers(driversData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRaces = selectedDriver
    ? races.filter(race => {
        // You would need to implement this based on your API structure
        // This is just a placeholder for the filtering logic
        return race.id.includes(selectedDriver)
      })
    : races

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-6">
            <Flag className="h-8 w-8 text-primary" />
            F1 Races
          </h1>
          
          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Filter by driver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Drivers</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} - {driver.team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <div className="f1-grid">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="race-card">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredRaces.map((race) => (
              <Link key={race.id} href={`/race/${race.id}`}>
                <Card className="race-card hover:cursor-pointer">
                  <CardHeader>
                    <CardTitle>{race.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{race.circuit}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(race.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}