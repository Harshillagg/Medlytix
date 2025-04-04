"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stethoscope, ClipboardList, Users, Calendar, Settings, Menu, LogOut, Home, Folder, FolderPlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: ReactNode
}

const navigationType = {
  patient: [
    { name: "Dashboard", href: `/dashboard/patient`, icon: Home },
    { name: "Pending Records", href: "/dashboard/patient/pending", icon: ClipboardList },
    { name: "Appointments", href: `/dashboard/patient/appointments`, icon: Calendar },
    { name: "Settings", href: `/dashboard/patient/settings`, icon: Settings },
  ],
  doctor: [
    { name: "Dashboard", href: `/dashboard/doctor`, icon: Home },
    { name: "Patient Search", href: `/dashboard/doctor/patient-search`, icon: Users },
    { name: "Create Record", href: `/dashboard/doctor/create-record`, icon: FolderPlusIcon },
    { name: "Reports", href: `/dashboard/doctor/reports`, icon: Folder },
    { name: "Settings", href: `/dashboard/doctor/settings`, icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: `/dashboard/admin`, icon: Home },
    { name: "Manage Users", href: `/dashboard/admin/users`, icon: Users },
    { name: "Reports", href: `/dashboard/admin/reports`, icon: ClipboardList },
    { name: "Settings", href: `/dashboard/admin/settings`, icon: Settings },
  ],
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Extract role from pathname
  const role = pathname.split("/")[2] as "doctor" | "patient" | "admin"

  const navigation = navigationType[role]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-semibold text-gray-900">Medlytix</span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-5 w-5",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link href="/" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
                  <span className="text-xl font-semibold text-gray-900">Medlytix</span>
                </div>
                {/* <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                  <X className="h-5 w-5" />
                </Button> */}
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                    )}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-5 w-5",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <Link href="/" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden">
          <Button variant="ghost" size="icon" className="px-4" onClick={() => setIsMobileNavOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center">
              <Stethoscope className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Medlytix</span>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

