import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// const MOCK_PATIENT_ID = "1"

export default async function PatientDashboard() {
  // const records = await getPatientRecords(MOCK_PATIENT_ID)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">View your medical records and history</p>
      </div>
      <Button asChild>
          <Link href="/dashboard/patient/add-record">Add New Record</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>View your complete medical history</CardDescription>
        </CardHeader>
        <CardContent>
          {/* {records.length > 0 ? (
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
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.createdAt)}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.prescription}</TableCell>
                    <TableCell>{record.doctor?.name || "Unknown"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : ( */}
            <div className="py-8 text-center border rounded-md">
              <p className="text-muted-foreground">No medical records found.</p>
            </div>
          {/* )} */}
        </CardContent>
      </Card>
    </div>
  )
}

