"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserApplications, deleteApplication, fetchMarathon } from "@/lib/api";
import { getUserId, getUserName, isRunner, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Application, Marathon } from "@/lib/types";
import { Calendar, MapPin, Clock, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [raceNames, setRaceNames] = useState<{ [raceId: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (!isRunner()) {
      router.push('/enterprise/dashboard');
      return;
    }

    loadApplications();
  }, [router]);

  const loadApplications = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const data = await getUserApplications(userId);
      setApplications(data);
      // Fetch race names for all applications
      const names: { [raceId: string]: string } = {};
      await Promise.all(
        data.map(async (app) => {
          try {
            if (!names[app.raceId]) {
              const race = await fetchMarathon(app.raceId);
              names[app.raceId] = race.name;
            }
          } catch (e) {
            names[app.raceId] = app.raceId; // fallback
          }
        })
      );
      setRaceNames(names);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load applications:", error);
      setIsLoading(false);
    }
  };

  const handleWithdrawApplication = async (raceId: string) => {
    try {
      const userId = getUserId();
      if (!userId) return;

      await deleteApplication(raceId, userId);
      await loadApplications(); // Reload the list
    } catch (error) {
      console.error("Failed to withdraw application:", error);
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
      <>
        <Navbar />
        <div className="container mx-auto py-10 px-4">
          <div className="text-center py-10">Cargando tus aplicaciones...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel del Corredor</h1>
          <p className="text-muted-foreground">
            ¡Bienvenido de vuelta, {getUserName()}! Aquí están tus aplicaciones a carreras.
          </p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                Aún no te has aplicado a ninguna carrera.
              </p>
              <Link href="/">
                <Button>Explorar Carreras</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{raceNames[application.raceId] || application.raceId}</CardTitle>
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
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">ID de Carrera: {application.raceId}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/marathons/id/${application.raceId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Carrera
                        </Button>
                      </Link>
                                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWithdrawApplication(application.raceId)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Retirar
                    </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 