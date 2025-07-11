"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Eye, Filter, X, Star } from "lucide-react";
import { MarathonForm } from "./marathon-form";
import { RatingDialog } from "./rating-dialog";
import { StarRating } from "@/components/ui/star-rating";
import { useRouter } from "next/navigation";
import { fetchMarathons, deleteMarathon, getEnterpriseMarathons, getUserApplications, applyToRace } from "@/lib/api";
import type { Marathon, Application } from "@/lib/types";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUserId, isEnterprise, isRunner, isAuthenticated, getUserName } from "@/lib/auth";

export function Marathons() {
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [filteredMarathons, setFilteredMarathons] = useState<Marathon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    dateFrom: "",
    dateTo: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [applyingRaceId, setApplyingRaceId] = useState<string | null>(null);
  
  // Get actual user ID from authentication
  const userId = getUserId();

  useEffect(() => {
    const getMarathons = async () => {
      try {
        let data: Marathon[];
        
        // If user is enterprise, show only their races
        if (isAuthenticated() && isEnterprise() && userId) {
          data = await getEnterpriseMarathons(userId);
        } else {
          // For runners and unauthenticated users, show all races
          data = await fetchMarathons({
            name: searchQuery,
            ...filters,
          });
        }
        
        setMarathons(data);
        setFilteredMarathons(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch races:", error);
        setIsLoading(false);
      }
    };

    const debouncer = setTimeout(async () => await getMarathons(), 300);

    return () => clearTimeout(debouncer);
  }, [searchQuery, filters, userId]);

  useEffect(() => {
    // Fetch user applications if runner
    const fetchApplications = async () => {
      if (isAuthenticated() && isRunner() && userId) {
        try {
          const apps = await getUserApplications(userId);
          setUserApplications(apps);
        } catch (e) {
          setUserApplications([]);
        }
      }
    };
    fetchApplications();
  }, [userId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleAddSuccess = (newMarathon: Marathon) => {
    setMarathons([...marathons, newMarathon]);
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = (updatedMarathon: Marathon) => {
    setMarathons(
      marathons.map((m) =>
        m._id === updatedMarathon._id ? updatedMarathon : m
      )
    );
    setIsEditDialogOpen(false);
  };

  const handleRatingChange = () => {
    // Refresh marathons to get updated ratings
    const getMarathons = async () => {
      try {
        let data: Marathon[];
        
        // If user is enterprise, show only their races
        if (isAuthenticated() && isEnterprise() && userId) {
          data = await getEnterpriseMarathons(userId);
        } else {
          // For runners and unauthenticated users, show all races
          data = await fetchMarathons({
            name: searchQuery,
            ...filters,
          });
        }
        
        setMarathons(data);
        setFilteredMarathons(data);
      } catch (error) {
        console.error("Failed to fetch races:", error);
      }
    };
    getMarathons();
  };

  const handleEdit = (marathon: Marathon) => {
    setSelectedMarathon(marathon);
    setIsEditDialogOpen(true);
  };

  const handleView = (marathon: Marathon) => {
    router.push(`/marathons/id/${marathon._id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this marathon?")) {
      try {
        await deleteMarathon(id);
        setMarathons(marathons.filter((m) => m._id !== id));
      } catch (error) {
        console.error("Failed to delete marathon:", error);
      }
    }
  };

  const hasApplied = (raceId: string) => {
    return userApplications.some(app => app.raceId === raceId);
  };

  const handleApply = async (raceId: string) => {
    if (!userId) return;
    setApplyingRaceId(raceId);
    try {
      await applyToRace(raceId, {
        runnerId: userId,
        runnerName: getUserName() || "",
      });
      // Refresh applications
      const apps = await getUserApplications(userId);
      setUserApplications(apps);
    } catch (e) {
      // Optionally show error
    } finally {
      setApplyingRaceId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Cargando carreras...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar carreras..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Fecha Desde</Label>
                  <Input
                    id="dateFrom"
                    name="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Fecha Hasta</Label>
                  <Input
                    id="dateTo"
                    name="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                    disabled={
                      !filters.location && !filters.dateFrom && !filters.dateTo
                    }
                  >
                    <X className="mr-2 h-4 w-4" />
                    Restablecer
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Only show Add Race for enterprise users */}
        {isAuthenticated() && isEnterprise() && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Carrera
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Carrera</DialogTitle>
              </DialogHeader>
              <MarathonForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredMarathons.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No se encontraron carreras</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Organizador</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarathons.map((marathon) => (
                <TableRow key={marathon._id}>
                  <TableCell className="font-medium">{marathon.name}</TableCell>
                  <TableCell>{marathon.date}</TableCell>
                  <TableCell>{marathon.location}</TableCell>
                  <TableCell>{marathon.organizer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={marathon.rating?.average || 0}
                        showCount={true}
                        count={marathon.rating?.count || 0}
                        size="sm"
                      />
                      {/* Only show rating dialog for runners, not enterprise users */}
                      {isAuthenticated() && isRunner() && userId && (
                        <RatingDialog
                          marathon={marathon}
                          userId={userId || ''}
                          onRatingChange={handleRatingChange}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Star className="h-3 w-3" />
                            </Button>
                          }
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        aria-label="Ver"
                        name="Ver"
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(marathon)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Button>
                      {/* Only show edit/delete for enterprise users and their own races */}
                      {isAuthenticated() && isEnterprise() && userId && marathon.createdBy === userId && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(marathon)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(marathon._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </>
                      )}
                      {/* Show Apply button for runners who have not applied */}
                      {isAuthenticated() && isRunner() && userId && !hasApplied(marathon._id) && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={applyingRaceId === marathon._id}
                          onClick={() => handleApply(marathon._id)}
                        >
                          {applyingRaceId === marathon._id ? "Aplicando..." : "Aplicar"}
                        </Button>
                      )}
                      {/* Optionally, show a disabled button if already applied */}
                      {isAuthenticated() && isRunner() && userId && hasApplied(marathon._id) && (
                        <Button variant="outline" size="sm" disabled>
                          Aplicado
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Carrera</DialogTitle>
          </DialogHeader>
          {selectedMarathon && (
            <MarathonForm
              marathon={selectedMarathon}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
