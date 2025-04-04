export interface Doctor {
  id: string;
  name: string;
  email: string;
}

export interface Medication {
  name: string;
  dosage: string;
  quantity: number;
  instructions?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  prescription: string;
  medications: Medication[];
  specialInstructions?: string;
  isAcceptedStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doctor: Doctor;
}
