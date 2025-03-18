import { Suspense } from "react"
import LoginPage from "@/components/login-page"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}

