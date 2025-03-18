import { Suspense } from "react"
import Dashboard from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}

