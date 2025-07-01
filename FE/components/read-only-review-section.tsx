import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { getRaceReviews } from "@/lib/api";
import type { Review } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export function ReadOnlyReviewSection({ raceId }: { raceId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await getRaceReviews(raceId);
        setReviews(response.reviews);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [raceId]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-6">
          <div className="text-center">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {review.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{review.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
} 