"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface MoodTabProps {
  userId: string | undefined
}

export default function MoodTab({ userId }: MoodTabProps) {
  const [energy, setEnergy] = useState("")
  const [comfort, setComfort] = useState("")
  const [emotion, setEmotion] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [moodTitle, setMoodTitle] = useState("")
  const [moodEmoji, setMoodEmoji] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [foodRec, setFoodRec] = useState("")
  const [spotifyLink, setSpotifyLink] = useState("")

  const analyzeMood = () => {
    if (!energy || !comfort || !emotion) {
      alert("Please select all mood options")
      return
    }

    // Determine overall mood
    let newMoodTitle, newMoodEmoji, newRecommendation, newFoodRec, newSpotifyLink

    if (emotion === "happy" && energy === "high" && comfort === "good") {
      newMoodTitle = "You're Feeling Great!"
      newMoodEmoji = "😊"
      newRecommendation = "Enjoy this positive energy! It's a good day to be productive and social."
      newFoodRec =
        "Treat yourself to something nutritious and delicious, like a colorful Buddha bowl or fresh fruit smoothie."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr" // Happy Hits playlist
    } else if (comfort === "pain") {
      newMoodTitle = "You're Experiencing Discomfort"
      newMoodEmoji = "😣"
      newRecommendation = "Take it easy today. Try a warm bath, gentle stretching, or a heating pad for relief."
      newFoodRec =
        "Anti-inflammatory foods like turmeric tea, ginger, dark chocolate, and berries can help reduce inflammation and pain."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u" // Peaceful Piano playlist
    } else if (energy === "low") {
      newMoodTitle = "You're Feeling Low Energy"
      newMoodEmoji = "😴"
      newRecommendation =
        "Listen to your body and rest if needed. Light exercise like walking can also help boost energy."
      newFoodRec = "Focus on iron-rich foods like spinach, lentils, and lean proteins to combat fatigue."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY" // Ambient Chill playlist
    } else if (emotion === "anxious") {
      newMoodTitle = "You're Feeling Anxious"
      newMoodEmoji = "😰"
      newRecommendation =
        "Practice deep breathing or meditation. Remember this feeling is temporary and connected to your cycle."
      newFoodRec = "Magnesium-rich foods like dark chocolate, nuts, and avocados can help reduce anxiety."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn" // Calming Acoustic playlist
    } else if (emotion === "irritated") {
      newMoodTitle = "You're Feeling Irritated"
      newMoodEmoji = "😠"
      newRecommendation =
        "Take some time for yourself. Self-care activities like reading or taking a walk can help reset your mood."
      newFoodRec = "Complex carbs like whole grains can boost serotonin levels and improve mood."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634" // Chill Tracks playlist
    } else {
      newMoodTitle = "Your Mood is Mixed"
      newMoodEmoji = "😐"
      newRecommendation = "Self-care is important. Listen to your body and give yourself what you need today."
      newFoodRec = "Focus on balanced meals with protein, complex carbs, and healthy fats to stabilize your mood."
      newSpotifyLink = "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7" // Mood Booster playlist
    }

    // Update state
    setMoodTitle(newMoodTitle)
    setMoodEmoji(newMoodEmoji)
    setRecommendation(newRecommendation)
    setFoodRec(newFoodRec)
    setSpotifyLink(newSpotifyLink)
    setShowResults(true)

    // Save mood data if signed in
    if (userId) {
      saveMoodData(energy, comfort, emotion, newMoodTitle)
    }
  }

  const saveMoodData = async (energy: string, comfort: string, emotion: string, moodTitle: string) => {
    if (!userId) return

    const moodData = {
      date: new Date(),
      energy,
      comfort,
      emotion,
      moodTitle,
    }

    try {
      const moodCollection = collection(db, "users", userId, "moods")
      await addDoc(moodCollection, moodData)
    } catch (error) {
      console.error("Error saving mood data:", error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Mood Tracker</CardTitle>
          <CardDescription>Track your emotional wellbeing throughout your cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">How are you feeling today? 🤔</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="energy">Energy Level</Label>
                  <Select value={energy} onValueChange={setEnergy}>
                    <SelectTrigger id="energy">
                      <SelectValue placeholder="Select your energy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Very Energetic 🔋</SelectItem>
                      <SelectItem value="medium">Moderate Energy ⚡</SelectItem>
                      <SelectItem value="low">Low Energy 😴</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comfort">Physical Comfort</Label>
                  <Select value={comfort} onValueChange={setComfort}>
                    <SelectTrigger id="comfort">
                      <SelectValue placeholder="Select comfort level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Comfortable 😊</SelectItem>
                      <SelectItem value="mild">Mild Discomfort 😕</SelectItem>
                      <SelectItem value="pain">Having Pain 😣</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotion">Emotional State</Label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger id="emotion">
                      <SelectValue placeholder="Select your emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">Happy 😊</SelectItem>
                      <SelectItem value="anxious">Anxious 😰</SelectItem>
                      <SelectItem value="irritated">Irritated 😠</SelectItem>
                      <SelectItem value="sad">Sad 😢</SelectItem>
                      <SelectItem value="neutral">Neutral 😐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={analyzeMood} className="w-full mt-4">
                  Analyze My Mood
                </Button>
              </div>
            </div>

            {showResults && (
              <Card className="overflow-hidden animate-in fade-in duration-500">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-5xl">{moodEmoji}</div>
                    <h4 className="text-xl font-semibold text-primary">{moodTitle}</h4>
                    <p className="text-muted-foreground">{recommendation}</p>

                    {/* Food recommendation section */}
                    <div className="w-full mt-4 p-4 bg-muted rounded-lg">
                      <h5 className="font-medium mb-2">Food Recommendation</h5>
                      <p className="text-sm mb-3">{foodRec}</p>
                      <a
                        href="https://zomato.onelink.me/xqzv/4bxbaocq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        Order Food on Zomato
                      </a>
                    </div>

                    {/* Music recommendation section */}
                    <div className="w-full mt-2 p-4 bg-muted rounded-lg">
                      <h5 className="font-medium mb-2">Music for Your Mood</h5>
                      <a
                        href={spotifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Listen on Spotify
                      </a>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full mt-4">
                      <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Self-care</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Rest</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted animate-in fade-in slide-in-from-bottom-5 duration-500 delay-200">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium">Connect</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

