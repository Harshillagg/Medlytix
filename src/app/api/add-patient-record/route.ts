import { NextRequest, NextResponse } from "next/server";
import {cloudinary} from "@/lib/cloudinary/config";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string, 10);
    const sex = formData.get("sex") as string;
    const medicalHistory = formData.get("medicalHistory") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Convert image file to Base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const mimeType = imageFile.type;
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "patient_records",
    });

    // Save record in MongoDB using Prisma
    const patientForm = await prisma.patientForm.create({
      data: {
        name,
        age,
        sex,
        medicalHistory,
        image: uploadResponse.secure_url, // Store Cloudinary URL
      },
    });

    return NextResponse.json({ message: "Uploaded successfully", patientForm }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
