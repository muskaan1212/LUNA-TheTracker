"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AboutTab() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle>About Luna</CardTitle>
          <CardDescription>Your personal period tracking companion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="mb-4 text-muted-foreground">
                Luna was created to help people track, understand, and manage their menstrual cycles with ease and
                privacy. We believe that period tracking should be simple, informative, and empowering.
              </p>
              <p className="text-muted-foreground">
                Our goal is to provide you with the tools and information you need to better understand your body and
                make informed decisions about your health.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data is yours. Luna is designed with privacy as a priority, ensuring that your sensitive health
                information remains secure and confidential.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
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
                  </div>
                  <div>
                    <h4 className="font-medium">Period Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Track your cycle, predict your next period, and monitor your fertile window.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
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
                  </div>
                  <div>
                    <h4 className="font-medium">Mood Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor your emotional wellbeing throughout your cycle.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Health Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Get personalized insights and recommendations based on your cycle data.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Educational Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Access helpful information about menstrual health and natural remedies.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

