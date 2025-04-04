import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const isAcceptedStatus = searchParams.get("isAcceptedStatus");

    if (!patientId) return ApiResponse(false, "Patient Id is required", 404);

    if (!isAcceptedStatus)
      return ApiResponse(false, "Request Status is required", 404);

    // Build the filter based on parameters
    const filter = {
      patientId,
      isAcceptedStatus,
    };

    const records = await prisma.medicalRecord.findMany({
      where: filter,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ records, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient records : ", error);
    return ApiResponse(false, "Error fetching patient records", 500);
  }
}
