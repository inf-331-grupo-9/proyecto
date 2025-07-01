"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Edit, Trash2, Send, X } from "lucide-react";
import { addOrUpdateReview, getUserReview, deleteReview, getRaceReviews } from "@/lib/api";
import type { Review, ReviewInput } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ReviewSectionProps {
  raceId: string;
  userId: string;
  userName: string;
}

export function ReviewSection({ raceId, userId, userName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    loadReviews();
    loadUserReview();
  }, [raceId, userId]);

  const loadReviews = async () => {
    try {
      const response = await getRaceReviews(raceId);
      setReviews(response.reviews);
      setIsLoadingReviews(false);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setIsLoadingReviews(false);
    }
  };

  const loadUserReview = async () => {
    try {
      const review = await getUserReview(raceId, userId);
      setUserReview(review);
      if (review) {
        setComment(review.comment);
      }
    } catch (error) {
      console.error("Failed to load user review:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;

    setIsLoading(true);
    try {
      const reviewData: ReviewInput = {
        userId,
        userName,
        comment: comment.trim(),
      };

      await addOrUpdateReview(raceId, reviewData);
      await loadReviews();
      await loadUserReview();
      setIsAddingReview(false);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    setIsLoading(true);
    try {
      await deleteReview(raceId, userId);
      setUserReview(null);
      setComment("");
      await loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReview = () => {
    setIsAddingReview(true);
  };

  const handleCancel = () => {
    setIsAddingReview(false);
    if (userReview) {
      setComment(userReview.comment);
    } else {
      setComment("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reseñas ({reviews.length})
          </CardTitle>
          {!userReview && !isAddingReview && (
            <Button onClick={() => setIsAddingReview(true)} size="sm">
              Escribir Reseña
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add/Edit Review Form */}
        {(isAddingReview || userReview) && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{userName}</span>
                  <div className="flex gap-2">
                    {userReview && !isAddingReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditReview}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {userReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteReview}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {isAddingReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {isAddingReview && (
                  <>
                    <Textarea
                      placeholder="Comparte tu experiencia con esta maratón..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {comment.length}/500 caracteres
                      </span>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!comment.trim() || isLoading}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isLoading ? "Guardando..." : userReview ? "Actualizar Reseña" : "Publicar Reseña"}
                      </Button>
                    </div>
                  </>
                )}
                {userReview && !isAddingReview && (
                  <div className="text-sm text-muted-foreground">
                    {userReview.comment}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-sm">{review.userName}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-1">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoadingReviews && reviews.length === 0 && !userReview && !isAddingReview && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay reseñas aún. ¡Sé el primero en escribir una!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 