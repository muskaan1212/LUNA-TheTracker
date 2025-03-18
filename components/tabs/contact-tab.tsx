"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

interface ContactTabProps {
  userId: string | undefined
}

export default function ContactTab({ userId }: ContactTabProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !rating || !message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Save feedback to Firestore
    try {
      const feedbackData = {
        name,
        email,
        rating: Number.parseInt(rating),
        message,
        userId: userId || "anonymous",
        createdAt: new Date(),
      }

      const feedbackCollection = collection(db, "feedback")
      await addDoc(feedbackCollection, feedbackData)

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input.",
      })

      // Reset form
      setName("")
      setEmail("")
      setRating("")
      setMessage("")
    } catch (error) {
      console.error("Error saving feedback:", error)
      toast({
        title: "Error",
        description: "There was an error saving your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Contact & Feedback</CardTitle>
          <CardDescription>We'd love to hear from you</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rate your experience</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Excellent</SelectItem>
                    <SelectItem value="4">Good</SelectItem>
                    <SelectItem value="3">Average</SelectItem>
                    <SelectItem value="2">Fair</SelectItem>
                    <SelectItem value="1">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Feedback</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us what you think..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

