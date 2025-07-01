"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/ui/star-rating"
import { RatingDialog } from "@/components/rating-dialog"
import { ReviewSection } from "@/components/review-section"
import { fetchMarathon } from "@/lib/api"
import type { Marathon } from "@/lib/types"
import { ArrowLeft, Calendar, MapPin, User, LinkIcon, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MarathonDetailPage({ params }: { params: { id: string } }) {
  const [marathon, setMarathon] = useState<Marathon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // For demo purposes, using a fixed userId. In a real app, this would come from auth context
  const userId = "demo-user-123"
  const userName = "Demo User"

  useEffect(() => {
    const getMarathonDetails = async () => {
      try {
        const data = await fetchMarathon(params.id)
        setMarathon(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch marathon details:", error)
        setError("Failed to load marathon details. Please try again later.")
        setIsLoading(false)
      }
    }

    getMarathonDetails()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Loading marathon details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10 text-red-500">{error}</div>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marathons
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!marathon) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Marathon not found</div>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marathons
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marathons
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl md:text-3xl">{marathon.name}</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <StarRating
                  rating={marathon.rating?.average || 0}
                  showCount={true}
                  count={marathon.rating?.count || 0}
                  size="lg"
                />
                <RatingDialog
                  marathon={marathon}
                  userId={userId}
                  trigger={
                    <Button variant="outline" size="sm" className="mt-2">
                      <Star className="h-4 w-4 mr-2" />
                      Rate this marathon
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video relative rounded-md overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=800" alt={marathon.name} fill className="object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Date:</span> {marathon.date}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Location:</span> {marathon.location}
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Organizer:</span> {marathon.organizer}
              </div>

              {marathon.link && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <a
                    href={marathon.link.startsWith("http") ? marathon.link : `https://${marathon.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{marathon.description || "No description available."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <ReviewSection 
        raceId={marathon._id} 
        userId={userId} 
        userName={userName} 
      />
    </div>
  )
}
