import prisma from "@/utils/prisma";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role") as Role;

    if (!userId || !role)
      return ApiResponse(false, "User Id and role is required", 404);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role,
      },
      include: {
        medicalRecords: {
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        doctorRecords: true,
      },
    });

    if (!user) return ApiResponse(false, "User not found", 404);

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return ApiResponse(false, "Error fetching user", 500);
  }
}
