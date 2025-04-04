"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MedicalRecord } from "@/types/RecordDetailsProps";
import axios, { AxiosError } from "axios";
import { Role } from "@prisma/client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import RecordDetailsModal from "./RecordDetailsModal";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  medicalRecords: MedicalRecord[];
};

export function PatientSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const res = await axios.get("/api/get-user-profile", {
        params: {
          userId: "67eea49d6e83009bf1955c0d",
          role: Role.PATIENT,
        },
      });

      setUserData(res.data.user);
      setRecords(res.data.user.medicalRecords);

      toast.success("User Fetched Successfully");
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Something went wrong while fetching user details .. Check Id again");
    } finally {
      setIsSearching(false);
    } 
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>
            Search for a patient ID to view their medical profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2" onSubmit={handleSearch}>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="query"
                placeholder="Search by patient ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {userData && (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>{userData.name}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="py-8 text-center border rounded-md">
                <p className="text-muted-foreground">
                  No medical records found.
                </p>
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
      )}

      <RecordDetailsModal
        selectedRecord={selectedRecord}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
}
