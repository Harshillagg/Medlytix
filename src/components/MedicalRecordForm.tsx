"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"

type Patient = {
  id: string
  name: string
  email: string
}

export function MedicalRecordForm() {
//   const { toast } = useToast()
  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Assuming the doctor is logged in with this ID
  const doctorId = "doc123" // This would come from authentication in a real app

//   const handlePatientSearch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!patientSearchQuery.trim()) return

//     const formData = new FormData()
//     formData.append("query", patientSearchQuery)

//     startTransition(async () => {
//       try {
//         const result = await searchPatients(formData)

//         if (result.success && result.data) {
//           setPatientSearchResults(result.data)
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
//     })
//   }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setPatientSearchResults([])
    setPatientSearchQuery("")
  }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!selectedPatient) {
//       toast({
//         title: "Patient required",
//         description: "Please select a patient first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     const formData = new FormData(e.currentTarget)
//     formData.append("patientId", selectedPatient.id)
//     formData.append("doctorId", doctorId)

//     try {
//       const result = await createMedicalRecord(formData)

//       if (result.success) {
//         toast({
//           title: "Medical record created",
//           description: `Record created for patient ${selectedPatient.name}`,
//         })

//         // Reset form
//         e.currentTarget.reset()
//         setSelectedPatient(null)
//       } else {
//         toast({
//           title: "Failed to create record",
//           description: typeof result.error === "string" ? result.error : "Please check the form for errors",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error creating medical record:", error)
//       toast({
//         title: "Failed to create record",
//         description: "An unexpected error occurred",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Medical Record</CardTitle>
        <CardDescription>Create a new medical record for a patient</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Search Patient
            </label>
            <form className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by patient name or ID..."
                  className="pl-8"
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending ? "Searching..." : "Search"}
              </Button>
            </form>

            {patientSearchResults.length > 0 && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <ul className="divide-y">
                  {patientSearchResults.map((patient) => (
                    <li
                      key={patient.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500">ID: {patient.id}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form  className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Patient ID
                  </label>
                  <Input value={selectedPatient?.id || ""} readOnly className="mt-2" />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Patient Name
                  </label>
                  <Input value={selectedPatient?.name || ""} readOnly className="mt-2" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Doctor ID
                </label>
                <Input value={doctorId} readOnly className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">Your doctor ID is automatically filled in</p>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Diagnosis
                </label>
                <Input name="diagnosis" placeholder="Enter diagnosis" required minLength={3} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Prescription
                </label>
                <Input name="prescription" placeholder="Enter prescription" required minLength={3} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Notes (Optional)
                </label>
                <Textarea name="notes" placeholder="Enter any additional notes" rows={4} className="mt-2" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !selectedPatient}>
              {isSubmitting ? "Creating Record..." : "Create Medical Record"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

