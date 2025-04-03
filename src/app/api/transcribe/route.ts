import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { writeFile } from "fs/promises";
import path from "path";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_LABS_API_KEY });

export async function POST(req: Request) {
  try {
    // Parse the FormData request
    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file temporarily (optional)
    const tempFilePath = path.join("/tmp", file.name);
    await writeFile(tempFilePath, buffer);

    // Convert Buffer to Blob
    const fileBlob = new Blob([buffer], { type: file.type });

    // Call Eleven Labs API for transcription
    const response = await client.speechToText.convert({
      file: fileBlob,
      model_id: "scribe_v1",
    });

    return NextResponse.json({ transcription: response.text });
  } catch (error) {
    console.error("Error processing transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
