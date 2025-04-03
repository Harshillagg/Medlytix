import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { ApiResponse } from '@/utils/ApiResponse';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordId, isAcceptedStatus } = body;

    if (!recordId || !isAcceptedStatus) return ApiResponse(false, "Record Id and Status is required", 404)

    const updatedRecord = await prisma.medicalRecord.update({
      where: {
        id: recordId,
      },
      data: {
        isAcceptedStatus : isAcceptedStatus
      },
    });

    return NextResponse.json({ success: true, record: updatedRecord }, {status: 200});
  } catch (error) {
    console.error('Error updating record status:', error);
    return ApiResponse(false, "Error updating record status", 500)
  }
}