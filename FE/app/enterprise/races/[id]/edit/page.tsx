"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchMarathon, updateMarathon } from "@/lib/api";
import { isEnterprise, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Marathon } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditRace({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    organizer: "",
    description: "",
    link: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || !isEnterprise()) {
      router.push('/auth/login');
      return;
    }

    loadMarathon();
  }, [params.id, router]);

  const loadMarathon = async () => {
    try {
      const marathon = await fetchMarathon(params.id);
      setFormData({
        name: marathon.name || "",
        location: marathon.location || "",
        date: marathon.date || "",
        organizer: marathon.organizer || "",
        description: marathon.description || "",
        link: marathon.link || ""
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load marathon:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      await updateMarathon(params.id, formData);
      router.push('/enterprise/dashboard');
    } catch (error) {
      console.error("Failed to update race:", error);
      alert("Error al actualizar la carrera. Por favor intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Cargando datos de la carrera...</div>
      </div>
    );
  }

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
          <CardTitle className="text-2xl">Editar Carrera</CardTitle>
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
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? "Guardando..." : "Guardar Cambios"}
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