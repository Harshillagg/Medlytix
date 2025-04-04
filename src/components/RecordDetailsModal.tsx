import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { MedicalRecord } from "@/types/RecordDetailsProps"
import { Dispatch, SetStateAction } from "react";

interface RecordsProps{
    selectedRecord: MedicalRecord | null;
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function RecordDetailsModal({selectedRecord, modalOpen, setModalOpen} : RecordsProps) {
    return(
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {selectedRecord && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRecord.diagnosis}</DialogTitle>
              <DialogDescription>
                Created on {format(new Date(selectedRecord.createdAt), "MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-medium">Doctor</h3>
                <p>{selectedRecord.doctor.name} ({selectedRecord.doctor.email})</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Diagnosis</h3>
                <p>{selectedRecord.diagnosis}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Prescription</h3>
                <p>{selectedRecord.prescription}</p>
              </div>
              
              {selectedRecord.medications.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium">Medications</h3>
                  <div className="space-y-2 mt-2">
                    {selectedRecord.medications.map((medication, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="font-medium">{medication.name} - {medication.dosage}</div>
                        <div>Quantity: {medication.quantity}</div>
                        {medication.instructions && <div>Instructions: {medication.instructions}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRecord.specialInstructions && (
                <div>
                  <h3 className="text-lg font-medium">Special Instructions</h3>
                  <p>{selectedRecord.specialInstructions}</p>
                </div>
              )}
              
              {selectedRecord.notes && (
                <div>
                  <h3 className="text-lg font-medium">Doctor's Notes</h3>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    )
}