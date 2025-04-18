import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, User } from "lucide-react"
import { useRouter } from "next/router"

export default function DriverPage() {
  const router = useRouter()
  const { id } = router.query
  const [driverDetails, setDriverDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/drivers/${id}`)
        const data = await response.json()
        setDriverDetails(data)
      } catch (error) {
        console.error('Error fetching driver details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDriverDetails()
    }
  }, [id])

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

  if (!driverDetails) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-destructive">Driver not found</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{driverDetails.name}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {driverDetails.team}
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {driverDetails.points} Points
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Season Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Race</th>
                    <th className="text-left p-4">Position</th>
                    <th className="text-left p-4">Points</th>
                    <th className="text-left p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {driverDetails.races.map((race) => (
                    <tr key={race.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{race.name}</td>
                      <td className="p-4">{race.position}</td>
                      <td className="p-4">{race.points}</td>
                      <td className="p-4">{new Date(race.date).toLocaleDateString()}</td>
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