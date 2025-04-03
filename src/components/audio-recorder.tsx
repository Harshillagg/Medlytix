"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onTranscriptionComplete: (text: string) => void
}

export function AudioRecorder({ onRecordingComplete, onTranscriptionComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm;codecs=opus" })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        setIsProcessing(true)
        setDebugInfo(null)

        console.log(`Audio size: ${audioBlob.size} bytes, type: ${audioBlob.type}`)

        await transcribeAudio(audioBlob)
        onRecordingComplete(audioBlob)
      }

      mediaRecorder.start(100)
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const response = await fetch('/api/transcribe', {
    //   const response = await fetch("/api/transcribe-test", {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()

      if (!response.ok) {
        setDebugInfo(`API Error: ${response.status} ${response.statusText} - ${responseText}`)
        throw new Error(`Transcription failed: ${response.status} ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        setDebugInfo(`Invalid JSON response: ${responseText}`)
        throw new Error("Invalid response format")
      }

      if (!data.transcription) {
        setDebugInfo(`Missing transcription in response: ${JSON.stringify(data)}`)
        throw new Error("No transcription in response")
      }

      onTranscriptionComplete(data.transcription)
      setIsProcessing(false)
      toast.success("Transcription completed successfully!")
    } catch (error) {
      console.error("Error transcribing audio:", error)
      toast.error(error instanceof Error ? error.message : "Failed to transcribe audio")
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button
            type="button"
            onClick={startRecording}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Start recording</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={stopRecording}
            variant="destructive"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Square className="h-5 w-5" />
            <span className="sr-only">Stop recording</span>
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Transcribing audio...</span>
          </div>
        )}
      </div>

      {audioURL && !isProcessing && (
        <div className="flex items-center gap-2">
          <audio src={audioURL} controls className="w-full" />
        </div>
      )}

      {debugInfo && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-mono whitespace-pre-wrap">
          {debugInfo}
        </div>
      )}
    </div>
  )
}
