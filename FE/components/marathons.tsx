"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import { MarathonForm } from "./marathon-form"
import { useRouter } from "next/navigation"
import { fetchMarathons, deleteMarathon } from "@/lib/api"
import type { Marathon } from "@/lib/types"

export function Marathons() {
  const [marathons, setMarathons] = useState<Marathon[]>([])
  const [filteredMarathons, setFilteredMarathons] = useState<Marathon[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMarathon, setSelectedMarathon] = useState<Marathon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getMarathons = async () => {
      try {
        const data = await fetchMarathons()
        setMarathons(data)
        setFilteredMarathons(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch marathons:", error)
        setIsLoading(false)
      }
    }

    getMarathons()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMarathons(marathons)
    } else {
      const filtered = marathons.filter((marathon) => marathon.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredMarathons(filtered)
    }
  }, [searchQuery, marathons])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleAddSuccess = (newMarathon: Marathon) => {
    setMarathons([...marathons, newMarathon])
    setIsAddDialogOpen(false)
  }

  const handleEditSuccess = (updatedMarathon: Marathon) => {
    setMarathons(marathons.map((m) => (m._id === updatedMarathon._id ? updatedMarathon : m)))
    setIsEditDialogOpen(false)
  }

  const handleEdit = (marathon: Marathon) => {
    setSelectedMarathon(marathon)
    setIsEditDialogOpen(true)
  }

  const handleView = (marathon: Marathon) => {
    router.push(`/marathons/${marathon._id}`)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this marathon?")) {
      try {
        await deleteMarathon(id)
        setMarathons(marathons.filter((m) => m._id !== id))
      } catch (error) {
        console.error("Failed to delete marathon:", error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading marathons...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search marathons..." value={searchQuery} onChange={handleSearch} className="pl-8" />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Marathon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Marathon</DialogTitle>
            </DialogHeader>
            <MarathonForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {filteredMarathons.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No marathons found</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarathons.map((marathon) => (
                <TableRow key={marathon._id}>
                  <TableCell className="font-medium">{marathon.name}</TableCell>
                  <TableCell>{marathon.date}</TableCell>
                  <TableCell>{marathon.location}</TableCell>
                  <TableCell>{marathon.organizer}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button aria-label="View" name="View" variant="outline" size="icon" onClick={() => handleView(marathon)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(marathon)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(marathon._id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
            <DialogTitle>Edit Marathon</DialogTitle>
          </DialogHeader>
          {selectedMarathon && <MarathonForm marathon={selectedMarathon} onSuccess={handleEditSuccess} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
