"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export default function DevelopersTab() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Meet the Developers</CardTitle>
          <CardDescription>The team behind Luna</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative w-full h-48">
                <Image src="/placeholder.svg?height=300&width=400" alt="Muskaan" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Muskaan</h3>
                <p className="text-sm text-muted-foreground mb-2">Lead Developer</p>
                <p className="text-sm text-muted-foreground">
                  Muskaan led the development of Luna, focusing on the core functionality and user experience.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative w-full h-48">
                <Image src="/placeholder.svg?height=300&width=400" alt="Harsh Pathak" fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Harsh Pathak</h3>
                <p className="text-sm text-muted-foreground mb-2">UI/UX Designer</p>
                <p className="text-sm text-muted-foreground">
                  Harsh crafted the beautiful and intuitive interface of Luna, ensuring a seamless user experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

