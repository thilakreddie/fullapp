"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Driver {
  id: string
  name: string
  number: string
  team: string
  points: number
  position: number
}

interface Race {
  id: string
  name: string
  date: string
  position: number
  points: number
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [races, setRaces] = useState<Race[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversResponse, racesResponse] = await Promise.all([
          fetch('http://localhost:8081/drivers'), // Updated port to 8081
          fetch('http://localhost:8081/races')   // Updated port to 8081
        ])
        const driversData = await driversResponse.json()
        const racesData = await racesResponse.json()
        setDrivers(driversData)
        setRaces(racesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchDriverRaces = async () => {
      if (selectedDriver) {
        try {
          setLoading(true)
          const response = await fetch(`http://localhost:8081/drivers/${selectedDriver}/races`) // Updated port to 8081
          const data = await response.json()
          setRaces(data)
        } catch (error) {
          console.error('Error fetching driver races:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (selectedDriver) {
      fetchDriverRaces()
    }
  }, [selectedDriver])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-2 mb-6">
            <Users className="h-8 w-8 text-primary" />
            F1 Drivers
          </h1>

          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a driver" />
            </SelectTrigger>
            <SelectContent>
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
          ) : selectedDriver ? (
            races.map((race) => (
              <Card key={race.id} className="race-card">
                <CardHeader>
                  <CardTitle>{race.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Position: {race.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Points: {race.points}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(race.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            drivers.map((driver) => (
              <Card key={driver.id} className="race-card">
                <CardHeader>
                  <CardTitle>{driver.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Team: {driver.team}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Position: {driver.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Points: {driver.points}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}