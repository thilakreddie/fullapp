"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, Users } from "lucide-react"
import Link from "next/link"
import F1Selector from '@/components/F1Selector'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">F1 Race Results</h1>
      <F1Selector />
    </main>
  )
}