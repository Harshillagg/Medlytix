import { AddRecordForm } from "@/components/add-record-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddRecordPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Record</h1>
          <p className="text-muted-foreground">Enter patient information and medical details</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/patient">Back to Dashboard</Link>
        </Button>
      </div>

      <AddRecordForm />
    </div>
  )
}

