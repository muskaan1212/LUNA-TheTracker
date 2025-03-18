"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Challenge {
  id: number
  title: string
  points: number
  category: string
}

interface ChallengesTabProps {
  userPoints: number
  updateUserPoints: (points: number) => void
  userId: string | undefined
}

export default function ChallengesTab({ userPoints, updateUserPoints, userId }: ChallengesTabProps) {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const { toast } = useToast()

  const availableChallenges: Challenge[] = [
    { id: 1, title: "Drink 8 glasses of water today", points: 10, category: "Hydration" },
    { id: 2, title: "Do a 15-minute yoga session", points: 15, category: "Exercise" },
    { id: 3, title: "Meditate for 10 minutes", points: 10, category: "Mental Health" },
    { id: 4, title: "Eat 5 servings of fruits and vegetables", points: 20, category: "Nutrition" },
    { id: 5, title: "Get 8 hours of sleep tonight", points: 15, category: "Sleep" },
    { id: 6, title: "Take a 20-minute walk", points: 10, category: "Exercise" },
    { id: 7, title: "Write in a gratitude journal", points: 10, category: "Mental Health" },
    { id: 8, title: "Try a new healthy recipe", points: 20, category: "Nutrition" },
    { id: 9, title: "Do a 10-minute stretching routine", points: 10, category: "Exercise" },
    { id: 10, title: "Practice deep breathing for 5 minutes", points: 5, category: "Stress Relief" },
  ]

  useEffect(() => {
    refreshChallenges()
  }, [])

  const refreshChallenges = () => {
    // Select 3 random challenges
    const newActiveChallenges: Challenge[] = []
    const allChallenges = [...availableChallenges]

    for (let i = 0; i < 3; i++) {
      if (allChallenges.length === 0) break

      const randomIndex = Math.floor(Math.random() * allChallenges.length)
      const challenge = allChallenges.splice(randomIndex, 1)[0]
      newActiveChallenges.push(challenge)
    }

    setActiveChallenges(newActiveChallenges)
  }

  const completeChallenge = (challengeId: number) => {
    const challenge = activeChallenges.find((c) => c.id === challengeId)

    if (!challenge) return

    // Add points
    const newPoints = userPoints + challenge.points
    updateUserPoints(newPoints)

    // Show success message
    toast({
      title: "Challenge Completed!",
      description: `You earned ${challenge.points} points by completing "${challenge.title}".`,
    })

    // Remove the completed challenge
    const remainingChallenges = activeChallenges.filter((c) => c.id !== challengeId)

    // Add a new challenge
    const unusedChallenges = availableChallenges.filter((c) => !remainingChallenges.some((ac) => ac.id === c.id))

    if (unusedChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedChallenges.length)
      const newChallenge = unusedChallenges[randomIndex]
      remainingChallenges.push(newChallenge)
    }

    setActiveChallenges(remainingChallenges)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Wellness Challenges</CardTitle>
          <CardDescription>Complete challenges to improve your health and earn points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              Your Points: <span className="text-primary">{userPoints}</span>
            </h3>
            <Button variant="outline" onClick={refreshChallenges}>
              Refresh Challenges
            </Button>
          </div>
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-card p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {challenge.category}
                    </Badge>
                    <h3 className="font-medium">{challenge.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">{challenge.points} points</p>
                    <Button size="sm" onClick={() => completeChallenge(challenge.id)}>
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

