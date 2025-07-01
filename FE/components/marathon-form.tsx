"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMarathon, updateMarathon } from "@/lib/api";
import { getUserId, isAuthenticated, isEnterprise } from "@/lib/auth";
import type { Marathon } from "@/lib/types";

interface MarathonFormProps {
  marathon?: Marathon;
  onSuccess: (marathon: Marathon) => void;
}

export function MarathonForm({ marathon, onSuccess }: MarathonFormProps) {
  const [formData, setFormData] = useState({
    name: marathon?.name || "",
    date: marathon?.date || "",
    location: marathon?.location || "",
    organizer: marathon?.organizer || "",
    description: marathon?.description || "",
    link: marathon?.link || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.date.trim()) {
      newErrors.date = "La fecha es requerida";
    }

    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es requerida";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "El organizador es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (marathon?._id) {
        result = await updateMarathon(marathon._id, formData);
      } else {
        // For creating new marathons, ensure user is authenticated and add createdBy field
        if (!isAuthenticated() || !isEnterprise()) {
          throw new Error("Only enterprise users can create marathons");
        }
        
        const userId = getUserId();
        if (!userId) {
          throw new Error("User not found");
        }
        
        result = await createMarathon({
          ...formData,
          createdBy: userId
        });
      }

      onSuccess(result);
    } catch (error) {
      console.error("Error saving marathon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">
          Fecha <span className="text-red-500">*</span>
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          Ubicación <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={errors.location ? "border-red-500" : ""}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizer">
          Organizador <span className="text-red-500">*</span>
        </Label>
        <Input
          id="organizer"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          className={errors.organizer ? "border-red-500" : ""}
        />
        {errors.organizer && (
          <p className="text-sm text-red-500">{errors.organizer}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Enlace</Label>
        <Input
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : marathon
            ? "Actualizar Maratón"
            : "Agregar Maratón"}
        </Button>
      </div>
    </form>
  );
}
