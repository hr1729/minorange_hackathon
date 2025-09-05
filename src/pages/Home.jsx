import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/shadcn/Card"
import { Button } from "../components/shadcn/Button"

const Home = () => {
  return (
    <div className="container mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome to Our Platform</CardTitle>
          <CardDescription>
            A modern React application built with Vite and shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            This is a demo application showcasing the power of React, Vite, and
            shadcn/ui components. Feel free to explore the different pages and
            features.
          </p>
          <div className="flex space-x-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home
