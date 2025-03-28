"use client"

// import type React from "react"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/components/ui/use-toast"

type Patient = {
  id: string
  name: string
  email: string
}

type MedicalRecord = {
  id: string
  diagnosis: string
  prescription: string
  notes?: string
  createdAt: Date
  doctor?: {
    name: string
  }
}

export function PatientSearch() {
//   const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([])
  const [isPending, startTransition] = useTransition()

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!searchQuery.trim()) return

//     const formData = new FormData()
//     formData.append("query", searchQuery)

//     startTransition(async () => {
//       try {
//         const result = await searchPatients(formData)

//         if (result.success && result.data) {
//           setSearchResults(result.data)
//           if (result.data.length === 0) {
//             toast({
//               title: "No patients found",
//               description: "Try a different search term",
//               variant: "destructive",
//             })
//           }
//         } else {
//           toast({
//             title: "Search failed",
//             description: typeof result.error === "string" ? result.error : "Failed to search patients",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error searching patients:", error)
//         toast({
//           title: "Search failed",
//           description: "An unexpected error occurred",
//           variant: "destructive",
//         })
//       }

//       setSelectedPatient(null)
//     })
//   }

//   const handlePatientSelect = async (patient: Patient) => {
//     setSelectedPatient(patient)

//     startTransition(async () => {
//       try {
//         const result = await getPatientRecords(patient.id)

//         if (result.success && result.data) {
//           setPatientRecords(result.data)
//         } else {
//           toast({
//             title: "Failed to fetch records",
//             description: typeof result.error === "string" ? result.error : "Could not retrieve patient records",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error fetching patient records:", error)
//         toast({
//           title: "Failed to fetch records",
//           description: "An unexpected error occurred",
//           variant: "destructive",
//         })
//       }
//     })
//   }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>Search for a patient by name or ID to view their medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="query"
                placeholder="Search by patient name or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Searching..." : "Search"}
            </Button>
          </form>

          {searchResults.length > 0 && !selectedPatient && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Search Results</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-mono text-sm">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                        >
                          View Records
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedPatient && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Medical Records for {selectedPatient.name}</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  Back to Results
                </Button>
              </div>

              {isPending ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Loading patient records...</p>
                </div>
              ) : patientRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Prescription</TableHead>
                      <TableHead>Doctor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.createdAt)}</TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>{record.prescription}</TableCell>
                        <TableCell>{record.doctor?.name || "Unknown"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center border rounded-md">
                  <p className="text-muted-foreground">No medical records found for this patient.</p>
                </div>
              )}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !isPending && (
            <div className="mt-6 text-center py-4">
              <p className="text-muted-foreground">No patients found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

