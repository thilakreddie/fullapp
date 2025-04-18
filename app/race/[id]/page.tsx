"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Clock, Flag } from "lucide-react"
import { useParams } from "next/navigation"

interface RaceResult {
  position: number
  driver: string
  team: string
  time: string
  points: number
}

interface RaceDetails {
  name: string
  date: string
  circuit: string
  results: RaceResult[]
}

export default function RacePage() {
  const params = useParams()
  const [raceDetails, setRaceDetails] = useState<RaceDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRaceDetails = async () => {
      try {
        if (!params || !params.id) {
          throw new Error("Invalid race ID");
        }
        const response = await fetch(`http://localhost:8081/races/${params.id}/results`)
        const data = await response.json()
        setRaceDetails(data)
      } catch (error) {
        console.error('Error fetching race details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params && params.id) {
      fetchRaceDetails()
    }
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (!raceDetails) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-destructive">Race not found</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{raceDetails.name}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              {raceDetails.circuit}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {new Date(raceDetails.date).toLocaleDateString()}
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Race Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Pos</th>
                    <th className="text-left p-4">Driver</th>
                    <th className="text-left p-4">Team</th>
                    <th className="text-left p-4">Time</th>
                    <th className="text-left p-4">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {raceDetails.results.map((result) => (
                    <tr key={result.position} className="border-b hover:bg-muted/50">
                      <td className="p-4">{result.position}</td>
                      <td className="p-4 font-medium">{result.driver}</td>
                      <td className="p-4">{result.team}</td>
                      <td className="p-4">{result.time}</td>
                      <td className="p-4">{result.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}