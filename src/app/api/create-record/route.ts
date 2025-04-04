import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { ApiResponse } from '@/utils/ApiResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      patientId,
      doctorId,
      diagnosis,
      prescription,
      medications,
      specialInstructions,
      notes,
    } = body;

    console.log("body : ", body)

    if (!patientId || !doctorId || !diagnosis || !prescription) {
      return ApiResponse(false, "All Fields are required", 404)
    }

    const newRecord = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId,
        diagnosis,
        prescription,
        medications,
        specialInstructions,
        notes
      },
    });

    return NextResponse.json({ 
        success: true, 
        record: newRecord 
    }, { status: 201 });
  }
  catch (error) {
    console.error('Error creating medical record:', error);
    return ApiResponse(false, "Error creating medical record", 500)
  }
}