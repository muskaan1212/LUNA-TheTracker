"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RemediesTab() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>Home Remedies</CardTitle>
          <CardDescription>Natural ways to manage period symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Heat Therapy</h3>
              </div>
              <p className="text-muted-foreground">
                Apply a heating pad to your lower abdomen to relieve cramps. The heat helps relax the muscles and
                increase blood flow, reducing pain.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Try a warm bath with Epsom salts for full-body relief.
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Exercise</h3>
              </div>
              <p className="text-muted-foreground">
                Light exercises like yoga, walking, or swimming can help reduce period pain. Exercise releases
                endorphins, which are natural pain relievers.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Try gentle yoga poses like Child's Pose or Cat-Cow Stretch.
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Herbal Tea</h3>
              </div>
              <p className="text-muted-foreground">
                Chamomile, ginger, or peppermint tea can help with menstrual discomfort. These herbs have
                anti-inflammatory and calming properties.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Add a teaspoon of honey for extra soothing benefits.
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Dietary Changes</h3>
              </div>
              <p className="text-muted-foreground">
                Reduce salt, sugar, caffeine, and alcohol. Increase foods rich in omega-3 fatty acids, calcium, and
                magnesium to help reduce inflammation.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Dark chocolate (70%+ cocoa) can help boost mood and reduce
                cravings.
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
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
                <h3 className="text-lg font-semibold">Stress Reduction</h3>
              </div>
              <p className="text-muted-foreground">
                Practice deep breathing, meditation, or mindfulness to reduce stress, which can worsen period symptoms.
                Try to get adequate sleep.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Try the 4-7-8 breathing technique: inhale for 4 seconds, hold
                for 7, exhale for 8.
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Essential Oils</h3>
              </div>
              <p className="text-muted-foreground">
                Lavender, clary sage, and marjoram essential oils can help reduce period pain when used in massage or
                aromatherapy.
              </p>
              <div className="mt-4 text-sm text-primary">
                <span className="font-medium">Tip:</span> Mix a few drops with a carrier oil and massage onto your lower
                abdomen.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

