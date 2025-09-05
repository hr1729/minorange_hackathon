import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/shadcn/Card"

const About = () => {
  return (
    <div className="container mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About Us</CardTitle>
          <CardDescription>Learn more about our platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground">
              We strive to create beautiful and functional web applications using
              modern technologies and best practices. Our focus is on delivering
              exceptional user experiences through clean, maintainable code.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Technology Stack</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>React - A JavaScript library for building user interfaces</li>
              <li>Vite - Next Generation Frontend Tooling</li>
              <li>TailwindCSS - A utility-first CSS framework</li>
              <li>shadcn/ui - Beautifully designed components</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default About
