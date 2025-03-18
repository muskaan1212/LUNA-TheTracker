"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HomeTabProps {
  userId: string | undefined
}

export default function HomeTab({ userId }: HomeTabProps) {
  const [lastPeriod, setLastPeriod] = useState("")
  const [cycleDuration, setCycleDuration] = useState(28)
  const [showResults, setShowResults] = useState(false)
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null)
  const [fertileStart, setFertileStart] = useState<Date | null>(null)
  const [fertileEnd, setFertileEnd] = useState<Date | null>(null)
  const [daysUntil, setDaysUntil] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [periodDays, setPeriodDays] = useState<Date[]>([])
  const [fertileWindow, setFertileWindow] = useState<Date[]>([])

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  const loadUserData = async () => {
    if (!userId) return

    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()

        if (userData.cycleData) {
          const { lastPeriod, cycleLength } = userData.cycleData

          if (lastPeriod && cycleLength) {
            // Convert Firestore timestamp to Date
            const lastPeriodDate = lastPeriod.toDate ? lastPeriod.toDate() : new Date(lastPeriod)
            setLastPeriod(lastPeriodDate.toISOString().split("T")[0])
            setCycleDuration(cycleLength)

            // Calculate next period
            calculateNextPeriod(lastPeriodDate, cycleLength)
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const saveUserCycleData = async (lastPeriodDate: Date, cycleLength: number) => {
    if (!userId) return

    try {
      const userDocRef = doc(db, "users", userId)
      await setDoc(
        userDocRef,
        {
          cycleData: {
            lastPeriod: lastPeriodDate,
            cycleLength: cycleLength,
          },
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error saving cycle data:", error)
    }
  }

  const calculateNextPeriod = (lastPeriodDate?: Date, cycleLength?: number) => {
    const lastDate = lastPeriodDate || new Date(lastPeriod)
    const cycle = cycleLength || cycleDuration

    if (isNaN(lastDate.getTime()) || isNaN(cycle)) {
      alert("Please enter a valid date and cycle length")
      return
    }

    // Calculate next period
    const nextDate = new Date(lastDate)
    nextDate.setDate(lastDate.getDate() + cycle)
    setNextPeriodDate(nextDate)

    // Calculate fertile window (typically 12-16 days before next period)
    const fertileStartDate = new Date(nextDate)
    fertileStartDate.setDate(nextDate.getDate() - 16)
    setFertileStart(fertileStartDate)

    const fertileEndDate = new Date(nextDate)
    fertileEndDate.setDate(nextDate.getDate() - 12)
    setFertileEnd(fertileEndDate)

    // Calculate days until next period
    const today = new Date()
    const daysUntilNext = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    setDaysUntil(daysUntilNext)

    // Update period days and fertile window for calendar
    const newPeriodDays: Date[] = []
    const newFertileWindow: Date[] = []

    // Add current period days (assume 5 days)
    for (let i = 0; i < 5; i++) {
      const periodDay = new Date(lastDate)
      periodDay.setDate(lastDate.getDate() + i)
      newPeriodDays.push(periodDay)
    }

    // Add next period days (assume 5 days)
    for (let i = 0; i < 5; i++) {
      const periodDay = new Date(nextDate)
      periodDay.setDate(nextDate.getDate() + i)
      newPeriodDays.push(periodDay)
    }

    // Add fertile window days
    const fertileDay = new Date(fertileStartDate)
    while (fertileDay <= fertileEndDate) {
      newFertileWindow.push(new Date(fertileDay))
      fertileDay.setDate(fertileDay.getDate() + 1)
    }

    setPeriodDays(newPeriodDays)
    setFertileWindow(newFertileWindow)
    setShowResults(true)

    // Save to user data if signed in
    if (userId && !lastPeriodDate) {
      saveUserCycleData(new Date(lastPeriod), cycle)
    }
  }

  const handleCalculate = () => {
    calculateNextPeriod()
  }

  const prevMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
  }

  const nextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
  }

  const isPeriodDay = (date: Date) => {
    return periodDays.some(
      (periodDate) =>
        periodDate.getDate() === date.getDate() &&
        periodDate.getMonth() === date.getMonth() &&
        periodDate.getFullYear() === date.getFullYear(),
    )
  }

  const isFertileDay = (date: Date) => {
    return fertileWindow.some(
      (fertileDate) =>
        fertileDate.getDate() === date.getDate() &&
        fertileDate.getMonth() === date.getMonth() &&
        fertileDate.getFullYear() === date.getFullYear(),
    )
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(year, month, 1).getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Add cells for all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isPeriod = isPeriodDay(date)
      const isFertile = isFertileDay(date)

      days.push(
        <div
          key={`day-${day}`}
          className={`h-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-all hover:scale-105 ${
            isPeriod ? "bg-primary text-primary-foreground" : isFertile ? "bg-green-500 text-white" : "hover:bg-muted"
          }`}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card col-span-full md:col-span-2 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <Card>
            <CardHeader>
              <CardTitle>Period Tracker</CardTitle>
              <CardDescription>Track your menstrual cycle and stay informed about your health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriod">Last Period Start Date</Label>
                    <Input
                      type="date"
                      id="lastPeriod"
                      value={lastPeriod}
                      onChange={(e) => setLastPeriod(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cycleDuration">Average Cycle Length (days)</Label>
                    <Input
                      type="number"
                      id="cycleDuration"
                      min="20"
                      max="45"
                      value={cycleDuration}
                      onChange={(e) => setCycleDuration(Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <Button onClick={handleCalculate}>Calculate Next Period</Button>

                {showResults && (
                  <Card className="mt-4 animate-in fade-in duration-500">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-primary mb-4">Your Results</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Next period expected:</p>
                          <p className="text-lg font-medium">
                            {nextPeriodDate?.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Fertile window:</p>
                          <p className="text-lg font-medium">
                            {fertileStart?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                            {fertileEnd?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Days until next period:</p>
                          <p className="text-lg font-medium">{daysUntil} days</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cycle length:</p>
                          <p className="text-lg font-medium">{cycleDuration} days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
          <Card>
            <CardHeader>
              <CardTitle>Cycle Stats</CardTitle>
              <CardDescription>Your cycle at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Avg. Cycle</p>
                  <p className="text-2xl font-bold">{cycleDuration} days</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Avg. Period</p>
                  <p className="text-2xl font-bold">5 days</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Last Period</p>
                  <p className="text-2xl font-bold">
                    {lastPeriod
                      ? new Date(lastPeriod).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "-"}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Next Period</p>
                  <p className="text-2xl font-bold">
                    {nextPeriodDate
                      ? nextPeriodDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Track your cycle on the calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-medium">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  <div className="text-center text-sm font-medium py-2">Sun</div>
                  <div className="text-center text-sm font-medium py-2">Mon</div>
                  <div className="text-center text-sm font-medium py-2">Tue</div>
                  <div className="text-center text-sm font-medium py-2">Wed</div>
                  <div className="text-center text-sm font-medium py-2">Thu</div>
                  <div className="text-center text-sm font-medium py-2">Fri</div>
                  <div className="text-center text-sm font-medium py-2">Sat</div>

                  {renderCalendar()}
                </div>

                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span className="text-sm">Period</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Fertile Window</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

