"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (error: any) {
      setError(`Login failed: ${error.message}`)
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: registerName,
        email: registerEmail,
        createdAt: new Date(),
        points: 0,
        cycleData: {
          cycleLength: 28,
          periodDuration: 5,
        },
      })

      router.push("/dashboard")
    } catch (error: any) {
      setError(`Registration failed: ${error.message}`)
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)

      // Check if this is a new user
      const userDocRef = doc(db, "users", result.user.uid)

      // Create a document for new users
      await setDoc(
        userDocRef,
        {
          name: result.user.displayName,
          email: result.user.email,
          createdAt: new Date(),
          points: 0,
          cycleData: {
            cycleLength: 28,
            periodDuration: 5,
          },
        },
        { merge: true },
      )

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign-in failed:", error)
      toast({
        title: "Google Sign-in Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Luna</h1>
          <p className="text-sm">Your Personal Period Tracker</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto grid md:grid-cols-2 gap-8 py-12 px-4">
        <div className="flex flex-col justify-center space-y-6 max-w-md mx-auto w-full">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Luna</h1>
            <p className="text-muted-foreground">
              Track your cycle, understand your body, and take control of your health
            </p>
          </div>

          <div className="w-full">
            <div className="flex border-b border-muted mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === "login" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === "register" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            <Card>
              {activeTab === "login" ? (
                <>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email and password to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="m@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="login-password">Password</Label>
                          <a href="#" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      {error && <p className="text-destructive text-sm">{error}</p>}
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Or sign in with</p>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        onClick={signInWithGoogle}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                            fill="#4285F4"
                          />
                        </svg>
                        Sign in with Google
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your information to create a Luna account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Jane Doe"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="m@example.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                        <Input
                          id="register-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      {error && <p className="text-destructive text-sm">{error}</p>}
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                      </Button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Or sign up with</p>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        onClick={signInWithGoogle}
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                            fill="#4285F4"
                          />
                        </svg>
                        Sign up with Google
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-green-200 rounded-full blur-3xl"></div>
            <div className="relative bg-card rounded-2xl shadow-xl p-6 h-full flex flex-col justify-center items-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">Track Your Cycle</h3>
                <p className="text-muted-foreground">
                  Luna helps you predict your next period, track symptoms, and understand your body better.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Period Tracking</span>
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
                  <span className="text-xs font-medium">Mood Tracking</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted animate-in fade-in slide-in-from-bottom-5 duration-500 delay-300">
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
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Health Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

