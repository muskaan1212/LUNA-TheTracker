"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import HomeTab from "@/components/tabs/home-tab"
import MoodTab from "@/components/tabs/mood-tab"
import RemediesTab from "@/components/tabs/remedies-tab"
import AnalysisTab from "@/components/tabs/analysis-tab"
import ChallengesTab from "@/components/tabs/challenges-tab"
import ContactTab from "@/components/tabs/contact-tab"
import AboutTab from "@/components/tabs/about-tab"
import DevelopersTab from "@/components/tabs/developers-tab"
import Chatbot from "@/components/chatbot"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        loadUserData(user.uid)
      } else {
        router.push("/")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadUserData = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.points) {
          setUserPoints(userData.points)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateUserPoints = async (points: number) => {
    setUserPoints(points)

    if (currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid)
        await setDoc(userDocRef, { points }, { merge: true })
      } catch (error) {
        console.error("Error saving points:", error)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1">
        {activeTab === "home" && <HomeTab userId={currentUser?.uid} />}
        {activeTab === "mood" && <MoodTab userId={currentUser?.uid} />}
        {activeTab === "remedies" && <RemediesTab />}
        {activeTab === "analysis" && <AnalysisTab userId={currentUser?.uid} />}
        {activeTab === "challenges" && (
          <ChallengesTab userPoints={userPoints} updateUserPoints={updateUserPoints} userId={currentUser?.uid} />
        )}
        {activeTab === "contact" && <ContactTab userId={currentUser?.uid} />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "developers" && <DevelopersTab />}
      </main>

      <Chatbot />
    </div>
  )
}

