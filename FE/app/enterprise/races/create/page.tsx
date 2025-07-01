"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMarathon } from "@/lib/api";
import { getUserId, isEnterprise, isAuthenticated, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateRace() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    organizer: "",
    description: "",
    link: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated() || !isEnterprise()) {
      alert("Por favor inicia sesión como usuario empresarial");
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    try {
      const userId = getUserId();
      
      if (!userId) {
        alert("Usuario no encontrado. Por favor inicia sesión nuevamente.");
        router.push('/auth/login');
        return;
      }

      await createMarathon({
        ...formData,
        createdBy: userId
      });
      
      router.push('/enterprise/dashboard');
    } catch (error) {
      console.error("Failed to create race:", error);
      alert("Error al crear la carrera. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/enterprise/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Nueva Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Carrera *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ingresa el nombre de la carrera"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Ingresa la ubicación de la carrera"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizador *</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                placeholder="Ingresa el nombre del organizador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingresa la descripción de la carrera"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Enlace del Sitio Web</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creando..." : "Crear Carrera"}
              </Button>
              <Link href="/enterprise/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 