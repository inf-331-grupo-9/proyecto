"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRaceApplications, updateApplicationStatus, fetchMarathon, updateMarathon } from "@/lib/api";
import { isEnterprise, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Application, Marathon } from "@/lib/types";
import { Calendar, MapPin, Clock, Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RaceApplications({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [marathon, setMarathon] = useState<Marathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || !isEnterprise()) {
      router.push('/auth/login');
      return;
    }

    loadData();
  }, [params.id, router]);

  const loadData = async () => {
    try {
      const [applicationsData, marathonData] = await Promise.all([
        getRaceApplications(params.id),
        fetchMarathon(params.id)
      ]);
      
      setApplications(applicationsData.applications);
      setMarathon(marathonData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load data:", error);
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: 'on-going' | 'cancelled') => {
    try {
      await updateApplicationStatus(applicationId, status);
      await loadData(); // Reload to get updated data
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Error al actualizar el estado de la aplicación. Por favor intenta nuevamente.");
    }
  };

  const handleCancelRace = async () => {
    if (!marathon) return;
    setIsCancelling(true);
    try {
      await updateMarathon(marathon._id, { ...marathon, status: 'cancelled' });
      await loadData();
    } catch (error) {
      alert("Error al cancelar la carrera. Por favor intenta nuevamente.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-going': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-going': return 'En Progreso';
      case 'cancelled': return 'Cancelado';
      default: return 'En Progreso';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-10">Cargando aplicaciones...</div>
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

      {marathon && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{marathon.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {marathon.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {marathon.date}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {marathon.status === 'cancelled' && (
                  <Badge className="bg-red-100 text-red-800">Carrera Cancelada</Badge>
                )}
                {marathon.status !== 'cancelled' && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelRace}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelando...' : 'Cancelar Carrera'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Aplicaciones ({applications.length})</h2>
        <p className="text-muted-foreground">
          Gestiona las aplicaciones de corredores para esta carrera.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">
              Aún no se han enviado aplicaciones para esta carrera.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{application.runnerName}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Aplicado {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusText(application.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    ID del Corredor: {application.runnerId}
                  </div>
                  {application.status === 'cancelled' && (
                    <div className="text-sm text-muted-foreground">
                      Estado actualizado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 