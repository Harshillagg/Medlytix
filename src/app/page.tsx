import Link from "next/link"
import { Stethoscope, User, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Medical Records System</h1>
          <p className="mt-4 text-lg text-gray-600">Select your role to access the dashboard</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Patient</CardTitle>
              <CardDescription>Access your medical records and history</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500">
              <p>View your medical history, prescriptions, and upcoming appointments</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/patient" className="w-full cursor-pointer">
                <Button className="w-full">Continue as Patient</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Doctor</CardTitle>
              <CardDescription>Manage patient records and treatments</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500">
              <p>Search patient records, create medical entries, and manage prescriptions</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/doctor" className="w-full cursor-pointer">
                <Button className="w-full">Continue as Doctor</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Admin</CardTitle>
              <CardDescription>System administration and oversight</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-gray-500">
              <p>Manage users, system settings, and access comprehensive reports and analysis</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/admin" className="w-full cursor-pointer">
                <Button className="w-full">Continue as Admin</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

