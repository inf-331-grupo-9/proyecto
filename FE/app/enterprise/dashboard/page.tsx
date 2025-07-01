"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEnterpriseMarathons, getRaceApplications } from "@/lib/api";
import { getUserId, getUserName, isEnterprise, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Marathon, ApplicationResponse } from "@/lib/types";
import { Calendar, MapPin, Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function EnterpriseDashboard() {
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [applications, setApplications] = useState<{ [key: string]: ApplicationResponse }>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    if (!isEnterprise()) {
      router.push('/dashboard');
      return;
    }

    loadEnterpriseData();
  }, [router]);

  const loadEnterpriseData = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const marathonData = await getEnterpriseMarathons(userId);
      setMarathons(marathonData);

      // Load applications for each marathon
      const appData: { [key: string]: ApplicationResponse } = {};
      for (const marathon of marathonData) {
        try {
          const raceApps = await getRaceApplications(marathon._id);
          appData[marathon._id] = raceApps;
        } catch (error) {
          console.error(`Failed to load applications for race ${marathon._id}:`, error);
          appData[marathon._id] = { applications: [], count: 0 };
        }
      }
      setApplications(appData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load enterprise data:", error);
      setIsLoading(false);
    }
  };

  const getTotalApplications = () => {
    return Object.values(applications).reduce((total, app) => total + app.count, 0);
  };

  const getCancelledApplications = () => {
    return Object.values(applications).reduce((total, app) => {
      return total + app.applications.filter(a => a.status === 'cancelled').length;
    }, 0);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-10 px-4">
          <div className="text-center py-10">Cargando tu panel...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Empresa</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido de vuelta, {getUserName()}! Gestiona tus carreras y aplicaciones.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Carreras</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marathons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Aplicaciones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalApplications()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones Canceladas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCancelledApplications()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <Link href="/enterprise/races/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Nueva Carrera
          </Button>
        </Link>
      </div>

      {/* Races List */}
      {marathons.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              Aún no has creado ninguna carrera.
            </p>
            <Link href="/enterprise/races/create">
              <Button>Crear Tu Primera Carrera</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Tus Carreras</h2>
          {marathons.map((marathon) => (
            <Card key={marathon._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{marathon.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
                  <Badge variant="secondary">
                    {applications[marathon._id]?.count || 0} aplicaciones
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {marathon.description || "No hay descripción disponible"}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/marathons/id/${marathon._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/enterprise/races/${marathon._id}/applications`}>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Aplicaciones
                      </Button>
                    </Link>
                    <Link href={`/enterprise/races/${marathon._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
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