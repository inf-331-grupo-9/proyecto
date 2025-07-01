"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Home, User, Building, FileText } from "lucide-react"
import { getCurrentUser, logout, isRunner, isEnterprise } from "@/lib/auth"
import { useRouter } from "next/navigation"
import type { User as UserType } from "@/lib/types"
import Link from "next/link"

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push("/auth/login")
    router.refresh()
  }

  if (!user) {
    return null
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-600">
          Runtrack
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Carreras
              </Button>
            </Link>
            {/* Always show My Applications for runners */}
            {user && user.role === 'runner' && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Mis Aplicaciones
                </Button>
              </Link>
            )}
            {isEnterprise() && (
              <Link href="/enterprise/dashboard">
                <Button variant="ghost" size="sm">
                  <Building className="mr-2 h-4 w-4" />
                  Panel
                </Button>
              </Link>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Always show My Applications for runners in dropdown */}
              {user && user.role === 'runner' && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mis Aplicaciones</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {isEnterprise() && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/enterprise/dashboard">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Panel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/enterprise/races/create">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Crear Carrera</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
