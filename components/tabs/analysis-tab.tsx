"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTheme } from "next-themes"
import Chart from "chart.js/auto"

interface AnalysisTabProps {
  userId: string | undefined
}

export default function AnalysisTab({ userId }: AnalysisTabProps) {
  const [age, setAge] = useState("")
  const [regularity, setRegularity] = useState("")
  const [primarySymptom, setPrimarySymptom] = useState("")
  const [symptomDuration, setSymptomDuration] = useState("0")
  const [painLevel, setPainLevel] = useState("5")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState(
    "Continue tracking for at least 3 months to establish your personal patterns. This will help you better predict and prepare for your periods.",
  )

  const symptomChartRef = useRef<HTMLCanvasElement>(null)
  const symptomChartInstance = useRef<Chart | null>(null)

  const { theme } = useTheme()

  useEffect(() => {
    if (userId) {
      loadUserData()
    }

    initializeChart()

    return () => {
      if (symptomChartInstance.current) {
        symptomChartInstance.current.destroy()
      }
    }
  }, [userId])

  useEffect(() => {
    updateChartTheme()
  }, [theme])

  const loadUserData = async () => {
    if (!userId) return

    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()

        if (userData.healthData) {
          const { age, regularity, primarySymptom, symptomDuration, painLevel, selectedSymptoms } = userData.healthData

          if (age) setAge(age.toString())
          if (regularity) setRegularity(regularity)
          if (primarySymptom) setPrimarySymptom(primarySymptom)
          if (symptomDuration) setSymptomDuration(symptomDuration.toString())
          if (painLevel) setPainLevel(painLevel.toString())
          if (selectedSymptoms) setSelectedSymptoms(selectedSymptoms)

          updateSymptomChart(selectedSymptoms)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const initializeChart = () => {
    if (symptomChartRef.current) {
      const ctx = symptomChartRef.current.getContext("2d")

      if (ctx) {
        symptomChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Cramps", "Headache", "Bloating", "Fatigue", "Mood Swings", "Acne"],
            datasets: [
              {
                data: [25, 15, 20, 18, 12, 10],
                backgroundColor: ["#e9a8a6", "#c28cad", "#a7beea", "#a4c5c6", "#ffb6c1", "#b19cd9"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: {
                    size: 12,
                  },
                  color: theme === "dark" ? "#f9f1f9" : "#4a4a4a",
                },
              },
              title: {
                display: false,
              },
            },
          },
        })
      }
    }
  }

  const updateChartTheme = () => {
    if (symptomChartInstance.current) {
      const options = symptomChartInstance.current.options
      if (options && options.plugins && options.plugins.legend) {
        options.plugins.legend.labels = {
          ...options.plugins.legend.labels,
          color: theme === "dark" ? "#f9f1f9" : "#4a4a4a",
        }
        symptomChartInstance.current.update()
      }
    }
  }

  const updateSymptomChart = (symptoms: string[]) => {
    if (!symptomChartInstance.current) return

    // Count occurrences of each symptom
    const symptomCounts: Record<string, number> = {}

    symptoms.forEach((symptom) => {
      if (!symptomCounts[symptom]) {
        symptomCounts[symptom] = 1
      } else {
        symptomCounts[symptom]++
      }
    })

    // If we have user-reported symptoms, use those
    if (Object.keys(symptomCounts).length > 0) {
      const labels = []
      const data = []

      for (const [symptom, count] of Object.entries(symptomCounts)) {
        labels.push(symptom.charAt(0).toUpperCase() + symptom.slice(1))
        data.push(count)
      }

      symptomChartInstance.current.data.labels = labels
      symptomChartInstance.current.data.datasets[0].data = data
      symptomChartInstance.current.update()
    }
  }

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms((prev) => [...prev, symptom])
    } else {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate personalized recommendations
    let newRecommendations = "Based on your data: "

    if (Number.parseInt(painLevel) > 7) {
      newRecommendations += "Your pain level is quite high. Consider consulting with a healthcare provider. "
    }

    if (selectedSymptoms.includes("cramps") && selectedSymptoms.includes("headache")) {
      newRecommendations += "For cramps and headaches, try magnesium-rich foods, gentle yoga, and staying hydrated. "
    }

    if (regularity === "irregular") {
      newRecommendations += "Tracking your cycle regularly can help identify patterns in irregular periods. "
    }

    setRecommendations(newRecommendations)

    // Update chart
    updateSymptomChart(selectedSymptoms)

    // Save health data if signed in
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId)
        await setDoc(
          userDocRef,
          {
            healthData: {
              age: Number.parseInt(age),
              regularity,
              primarySymptom,
              symptomDuration: Number.parseInt(symptomDuration),
              painLevel: Number.parseInt(painLevel),
              selectedSymptoms,
            },
          },
          { merge: true },
        )

        alert("Your health data has been analyzed!")
      } catch (error) {
        console.error("Error saving health data:", error)
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Period Analysis</CardTitle>
          <CardDescription>Understand your cycle patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input
                    type="number"
                    id="age"
                    min="8"
                    max="60"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regularity">Period Regularity</Label>
                  <Select value={regularity} onValueChange={setRegularity}>
                    <SelectTrigger id="regularity">
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular (Every 21-35 days)</SelectItem>
                      <SelectItem value="irregular">Irregular (Unpredictable)</SelectItem>
                      <SelectItem value="veryIrregular">Very Irregular (>35 days apart)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Common Symptoms</Label>
                  <Select value={primarySymptom} onValueChange={setPrimarySymptom}>
                    <SelectTrigger id="symptoms">
                      <SelectValue placeholder="Select primary symptom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cramps">Severe Cramps</SelectItem>
                      <SelectItem value="headache">Headaches</SelectItem>
                      <SelectItem value="mood">Mood Swings</SelectItem>
                      <SelectItem value="fatigue">Fatigue</SelectItem>
                      <SelectItem value="none">No Major Symptoms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptomDuration">Symptom Duration (days)</Label>
                  <Input
                    type="number"
                    id="symptomDuration"
                    min="0"
                    max="14"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="painLevel">Pain Level (1-10)</Label>
                  <Input
                    type="range"
                    id="painLevel"
                    className="w-full"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="block mb-2">Select Symptoms (Multiple)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-cramps"
                        checked={selectedSymptoms.includes("cramps")}
                        onCheckedChange={(checked) => handleSymptomChange("cramps", checked as boolean)}
                      />
                      <label htmlFor="symptom-cramps" className="text-sm">
                        Cramps
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-headache"
                        checked={selectedSymptoms.includes("headache")}
                        onCheckedChange={(checked) => handleSymptomChange("headache", checked as boolean)}
                      />
                      <label htmlFor="symptom-headache" className="text-sm">
                        Headache
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-bloating"
                        checked={selectedSymptoms.includes("bloating")}
                        onCheckedChange={(checked) => handleSymptomChange("bloating", checked as boolean)}
                      />
                      <label htmlFor="symptom-bloating" className="text-sm">
                        Bloating
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-fatigue"
                        checked={selectedSymptoms.includes("fatigue")}
                        onCheckedChange={(checked) => handleSymptomChange("fatigue", checked as boolean)}
                      />
                      <label htmlFor="symptom-fatigue" className="text-sm">
                        Fatigue
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-mood"
                        checked={selectedSymptoms.includes("mood")}
                        onCheckedChange={(checked) => handleSymptomChange("mood", checked as boolean)}
                      />
                      <label htmlFor="symptom-mood" className="text-sm">
                        Mood Swings
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symptom-acne"
                        checked={selectedSymptoms.includes("acne")}
                        onCheckedChange={(checked) => handleSymptomChange("acne", checked as boolean)}
                      />
                      <label htmlFor="symptom-acne" className="text-sm">
                        Acne
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Data
                </Button>
              </form>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Cycle Insights</h3>
              <Card>
                <CardContent className="p-6">
                  {/* Pie Chart Container */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Symptom Distribution</h4>
                    <div className="aspect-square max-w-md mx-auto">
                      <canvas ref={symptomChartRef} aria-label="Symptom distribution pie chart" role="img"></canvas>
                    </div>
                  </div>

                  <p className="mb-4">Based on your data, here are some insights:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Your cycle length is within the normal range</li>
                    <li>Your symptoms are common among people your age</li>
                    <li>Consider tracking your mood alongside your cycle</li>
                    <li>Hydration may help with your reported symptoms</li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-muted">
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <p className="text-sm text-muted-foreground">{recommendations}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

