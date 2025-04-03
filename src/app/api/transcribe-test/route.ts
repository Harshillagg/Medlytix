import { NextResponse } from "next/server"

// This is a test endpoint that doesn't rely on Eleven Labs
// It simply returns a mock transcription to verify the client-side code works
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log(`Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return a mock transcription
    return NextResponse.json({
      transcription: "This is a test transcription. Your audio was received successfully.",
    })
  } catch (error) {
    console.error("Error in test transcription:", error)
    return NextResponse.json(
      { error: `Test endpoint error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

