"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AudioRecorder } from "./audio-recorder"

export function AddRecordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState("")

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0])
    }
  }

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob)
    // In a real app, you would send this blob to a transcription service
    setTranscription("This is where the transcription would appear...")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would normally send the form data to your API
    // const formData = new FormData(e.currentTarget)
    // const response = await fetch('/api/records', { method: 'POST', body: formData })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Enter the patient's personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" min="0" required />
              </div>

              <div className="grid gap-2">
                <Label>Sex</Label>
                <RadioGroup defaultValue="male" name="sex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical-history">Medical History</Label>
            <Textarea
              id="medical-history"
              name="medicalHistory"
              placeholder="Enter any relevant medical history..."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescription">Prescription Photo</Label>
            <div className="grid gap-2">
              <Input
                id="prescription"
                name="prescription"
                type="file"
                accept="image/*"
                onChange={handlePrescriptionChange}
              />
              {prescriptionFile && (
                <p className="text-sm text-muted-foreground">Selected file: {prescriptionFile.name}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Voice Notes</Label>
            <AudioRecorder onRecordingComplete={handleAudioRecorded} />

            {audioBlob && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="transcription">Transcription</Label>
                <Textarea
                  id="transcription"
                  name="transcription"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

