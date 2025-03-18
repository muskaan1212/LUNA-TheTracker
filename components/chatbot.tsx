"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, X } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi there! I'm Luna's AI assistant. How can I help you with your period tracking or health questions today? You can ask me about Luna's features, how to track your period, or any other health-related questions.",
        },
      ])
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const checkKnowledgeBase = (question: string) => {
    // Convert question to lowercase for case-insensitive matching
    const lowerQuestion = question.toLowerCase().trim()

    // Knowledge base for common questions
    const knowledgeBase: Record<string, string> = {
      // App information
      "what is luna":
        "Luna is a personal period tracking app that helps you track your menstrual cycle, predict your next period, monitor your mood, and understand your body better.",
      "what does luna do":
        "Luna helps you track your menstrual cycle, predict your next period, monitor your fertile window, track your mood, and provides health insights and home remedies for period symptoms.",
      "how does luna work":
        "Luna works by tracking your period dates and cycle length. You can input your last period date and average cycle length, and Luna will calculate your next period, fertile window, and provide personalized insights.",

      // Features
      "what features does luna have":
        "Luna offers several features including: period tracking, mood tracking, home remedies for period symptoms, health insights and analysis, wellness challenges, and educational resources about menstrual health.",
      "can luna predict my period":
        "Yes! Luna can predict your next period based on your previous cycle data. Just enter your last period date and average cycle length on the home page.",
      "how do i track my mood":
        "You can track your mood by clicking on the 'Mood Tracker' tab. There, you can select your energy level, physical comfort, and emotional state, and Luna will provide personalized recommendations.",

      // Privacy
      "is my data private":
        "Yes, Luna takes privacy seriously. Your health information remains secure and confidential. We believe your data is yours and design our app with privacy as a priority.",

      // Usage
      "how do i calculate my next period":
        "To calculate your next period, go to the Home tab, enter your last period start date and your average cycle length, then click the 'Calculate Next Period' button.",
      "what are the home remedies":
        "Luna provides several home remedies for period symptoms including heat therapy, light exercise, herbal teas, dietary changes, stress reduction techniques, and essential oils. You can find detailed information in the 'Home Remedies' tab.",
      "how do challenges work":
        "The Wellness Challenges feature offers daily health challenges that you can complete to earn points. These challenges are designed to improve your overall health and wellbeing during your cycle.",

      // Help
      help: "I can help you with information about Luna's features, how to track your period, mood tracking, home remedies, and more. What would you like to know about?",
    }

    // Check for exact matches
    if (knowledgeBase[lowerQuestion]) {
      return knowledgeBase[lowerQuestion]
    }

    // Check for partial matches
    for (const key in knowledgeBase) {
      if (lowerQuestion.includes(key) || key.includes(lowerQuestion)) {
        return knowledgeBase[key]
      }
    }

    // Check for keyword matches
    const keywords: Record<string, string> = {
      period:
        "Luna helps you track your menstrual cycle and predict your next period. You can enter your last period date and cycle length on the Home tab.",
      track:
        "Luna offers tracking for your period, mood, and symptoms. You can access these features from the main navigation menu.",
      calendar:
        "Luna provides a calendar view where you can see your period days and fertile window. You can find this on the Home tab.",
      mood: "The Mood Tracker feature allows you to record your energy level, physical comfort, and emotional state. Luna will provide personalized recommendations based on your inputs.",
      remedy:
        "Luna offers various home remedies for period symptoms including heat therapy, exercise, herbal teas, and more. Check the Home Remedies tab for details.",
      privacy: "Luna takes your privacy seriously. Your health information remains secure and confidential.",
      challenge:
        "Luna's Wellness Challenges feature offers daily health tasks to improve your wellbeing and earn points.",
      fertile: "Luna can calculate your fertile window based on your cycle data to help with family planning.",
    }

    for (const keyword in keywords) {
      if (lowerQuestion.includes(keyword)) {
        return keywords[keyword]
      }
    }

    // No match found
    return null
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Check if we have a predefined answer
    const predefinedAnswer = checkKnowledgeBase(input)

    if (predefinedAnswer) {
      // Add predefined answer with a small delay to make it feel more natural
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: predefinedAnswer }])
        setIsLoading(false)
      }, 500)
    } else {
      try {
        // Prepare context about Luna
        const contextMessage = `You are Luna's AI assistant for a period tracking app. Luna helps users track their menstrual cycle, predict their next period, monitor their mood, and provides health insights and home remedies. 

        Features of Luna include:
        - Period tracking and prediction
        - Mood tracking
        - Calendar view with period and fertile window
        - Home remedies for period symptoms
        - Health insights and analysis
        - Wellness challenges

        Be helpful, friendly, and informative. If asked about specific medical advice, remind users to consult healthcare professionals.`

        // Call AI API
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: `${contextMessage}\n\nUser: ${input}\n\nAssistant:`,
          maxTokens: 500,
          apiKey:
            "sk-proj-IFkywdSxH4ygwcnN1a--aI-ATrwU0o8y2nf5S461w6aly-TwWFL2-7xfxPKyeT1R39k_gNUBVMT3BlbkFJpiovWzHhKMhEXFJBXSb3mzWIUtAdNjH3JQ4aNCqFPiJj_d7EKR3a5sEDRlKaRvQ9K9RzwYRQ4AAt",
        })

        // Add AI response to chat
        setMessages((prev) => [...prev, { role: "assistant", content: text }])
      } catch (error) {
        console.error("Error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting. Please check your internet connection and try again.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Bubble */}
      <Button className="fixed bottom-5 right-5 w-14 h-14 rounded-full shadow-lg z-50" onClick={toggleChat}>
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Container */}
      <div
        className={`fixed bottom-24 right-5 w-80 md:w-96 bg-card rounded-lg shadow-lg z-50 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        style={{ height: "500px" }}
      >
        {/* Chat Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <h3 className="font-semibold">Luna Assistant</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-foreground/20"
            onClick={toggleChat}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "ml-auto bg-primary text-white rounded-br-none"
                  : "mr-auto bg-muted text-foreground rounded-bl-none"
              } animate-in fade-in slide-in-from-bottom-3 duration-300`}
            >
              {message.content}
            </div>
          ))}

          {isLoading && (
            <div className="mb-4 max-w-[80%] p-3 rounded-lg mr-auto bg-muted text-foreground rounded-bl-none animate-pulse">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 rounded-l-md border border-r-0 focus:outline-none focus:ring-1 focus:ring-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button className="rounded-l-none" onClick={sendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

