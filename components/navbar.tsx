"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogout: () => void
}

export default function Navbar({ activeTab, setActiveTab, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    closeMobileMenu()
  }

  return (
    <>
      <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="text-xl font-bold" onClick={() => handleTabClick("home")}>
                Luna
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "home" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("home")}
              >
                Home
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "mood" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("mood")}
              >
                Mood Tracker
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "remedies" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("remedies")}
              >
                Home Remedies
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "analysis" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("analysis")}
              >
                Analysis
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "challenges" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("challenges")}
              >
                Challenges
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "contact" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("contact")}
              >
                Contact
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "about" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("about")}
              >
                About
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "developers" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"}`}
                onClick={() => handleTabClick("developers")}
              >
                Meet the Team
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-white hover:bg-primary-foreground/20"
              >
                {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Mobile Navigation Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-primary-foreground/20"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMobileMenu}></div>}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-background z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "home" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("home")}
          >
            Home
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "mood" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("mood")}
          >
            Mood Tracker
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "remedies" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("remedies")}
          >
            Home Remedies
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "analysis" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("analysis")}
          >
            Analysis
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "challenges" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("challenges")}
          >
            Challenges
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "contact" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("contact")}
          >
            Contact
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "about" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("about")}
          >
            About
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "developers" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
            onClick={() => handleTabClick("developers")}
          >
            Meet the Team
          </button>
          <Button variant="outline" className="mt-4" onClick={onLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </>
  )
}

