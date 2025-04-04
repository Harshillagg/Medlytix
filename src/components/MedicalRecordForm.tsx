"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Role } from "@prisma/client";
import toast from "react-hot-toast";

type Patient = {
  id: string;
  name: string;
  email: string;
};

export default function MedicalRecordForm() {
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userData, setUserData] = useState<Patient | null>(null);
  const [medications, setMedications] = useState([
    { name: "", dosage: "", quantity: 1, instructions: "" },
  ]);

  const handleMedicationChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", quantity: 1, instructions: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const doctorId = "67eea49d6e83009bf1955c0e";

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

      toast.success("User Fetched Successfully");
    } catch (err) {
      console.error("Search error:", err);
      toast.error(
        "Something went wrong while fetching user details .. Check Id again"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData) {
      toast.error("Please select a patient first");
      return;
    }

    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      patientId: userData.id,
      doctorId: doctorId,
      diagnosis: form.get("diagnosis") as string,
      prescription: form.get("prescription") as string,
      specialInstructions: form.get("specialInstructions") as string,
      notes: form.get("notes") as string,
      medications: medications,
    };

    try {
      await axios.post("/api/create-record", payload);

      toast.success(`Record created for patient ${userData.name}`);

      setUserData(null);
    } catch (error) {
      console.error("Error creating medical record:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Medical Record</CardTitle>
        <CardDescription>
          Create a new medical record for a patient
        </CardDescription>
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
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Patient ID
                  </label>
                  <Input value={userData?.id || ""} readOnly className="mt-2" />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Patient Name
                  </label>
                  <Input
                    value={userData?.name || ""}
                    readOnly
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Doctor ID
                </label>
                <Input value={doctorId} readOnly className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Your doctor ID is automatically filled in
                </p>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Diagnosis
                </label>
                <Input
                  name="diagnosis"
                  placeholder="Enter diagnosis"
                  required
                  minLength={3}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Prescription
                </label>
                <Input
                  name="prescription"
                  placeholder="Enter prescription"
                  required
                  minLength={3}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none">
                  Medications
                </label>
                <div className="space-y-4 mt-2">
                  {medications.map((med, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                    >
                      <Input
                        placeholder="Name"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={med.quantity}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        required
                        min={1}
                      />
                      <Input
                        placeholder="Instructions (optional)"
                        value={med.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="md:col-span-4 w-fit"
                          onClick={() => removeMedication(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addMedication}
                    variant="outline"
                  >
                    + Add Medication
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Special Instructions (If any)
                </label>
                <Textarea
                  name="specialInstructions"
                  placeholder="Enter any special instruction"
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Notes (Optional)
                </label>
                <Textarea
                  name="notes"
                  placeholder="Enter any additional notes"
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="max-w-fit ml-auto cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Record..." : "Create Medical Record"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
