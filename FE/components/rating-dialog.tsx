"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Star } from "lucide-react";
import { addOrUpdateRating, getUserRating, deleteRating } from "@/lib/api";
import type { Marathon } from "@/lib/types";

interface RatingDialogProps {
  marathon: Marathon;
  userId: string;
  onRatingChange?: () => void;
  trigger?: React.ReactNode;
}

export function RatingDialog({ 
  marathon, 
  userId, 
  onRatingChange, 
  trigger 
}: RatingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUserRating();
    }
  }, [isOpen, marathon._id, userId]);

  const loadUserRating = async () => {
    try {
      const rating = await getUserRating(marathon._id, userId);
      if (rating) {
        setUserRating(rating.rating);
        setCurrentRating(rating.rating);
      } else {
        setUserRating(null);
        setCurrentRating(0);
      }
    } catch (error) {
      console.error("Failed to load user rating:", error);
    }
  };

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating);
  };

  const handleSubmit = async () => {
    if (currentRating === 0) return;

    setIsLoading(true);
    try {
      await addOrUpdateRating(marathon._id, {
        userId,
        rating: currentRating,
      });
      setUserRating(currentRating);
      onRatingChange?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteRating(marathon._id, userId);
      setUserRating(null);
      setCurrentRating(0);
      onRatingChange?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            {userRating ? "Editar Calificación" : "Calificar"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Calificar "{marathon.name}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Cómo calificarías esta maratón?
            </p>
            <StarRating
              rating={currentRating}
              interactive={true}
              onRatingChange={handleRatingChange}
              size="lg"
              className="justify-center"
            />
            {currentRating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Seleccionaste {currentRating} estrella{currentRating !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            {userRating && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Eliminar Calificación
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={currentRating === 0 || isLoading}
            >
              {isLoading ? "Guardando..." : userRating ? "Actualizar Calificación" : "Enviar Calificación"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 