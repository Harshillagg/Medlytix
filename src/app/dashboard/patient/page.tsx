"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import RecordDetailsModal from "@/components/RecordDetailsModal";
import { MedicalRecord } from "@/types/RecordDetailsProps";

export default function PatientDashboard() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const userId = "67eea49d6e83009bf1955c0d";

        const response = await axios.get(`/api/get-records`, {
          params: {
            patientId: userId,
            isAcceptedStatus: "accepted",
          },
        });

        setRecords(response.data.records);
      } catch (error) {
        console.error("Error fetching records : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          View your medical records and history
        </p>
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading your records...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-8 text-center border rounded-md">
              <p className="text-muted-foreground">No medical records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewRecord(record)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{record.diagnosis}</h3>
                      <p className="text-sm text-muted-foreground">
                        Dr. {record.doctor.name} •{" "}
                        {format(new Date(record.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record details modal */}
      <RecordDetailsModal
        selectedRecord={selectedRecord}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
}
