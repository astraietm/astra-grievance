import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';
import { sendGrievanceStatusUpdateEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// 1. GET Grievance Details for Admin
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const grievance = await prisma.grievance.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        attachments: true,
        adminNotes: {
          include: {
            admin: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        responses: {
          include: {
            admin: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        identityAccessLogs: {
          include: {
            admin: { select: { id: true, name: true, email: true } },
          },
          orderBy: { accessedAt: 'desc' },
        },
      },
    });

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: 'Grievance not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userRole: user.role,
      grievance: {
        id: grievance.id,
        publicId: grievance.publicId,
        category: grievance.category,
        subject: grievance.subject,
        description: grievance.description,
        priority: grievance.priority,
        status: grievance.status,
        wantsResponse: grievance.wantsResponse,
        assignedTo: grievance.assignedTo,
        createdAt: grievance.createdAt,
        updatedAt: grievance.updatedAt,
        attachments: grievance.attachments,
        adminNotes: grievance.adminNotes,
        responses: grievance.responses,
        identityRestricted: true, // Submitter identity hidden by default
        identityLogsCount: grievance.identityAccessLogs.length,
        identityLogs: user.role === 'SUPER_ADMIN' ? grievance.identityAccessLogs : [],
      },
    });
  } catch (error) {
    console.error('Error fetching admin grievance detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grievance details.' },
      { status: 500 }
    );
  }
}

// 2. PATCH Update Grievance Status / Priority / Assignee
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, priority, assignedToId } = body;

    const existingGrievance = await prisma.grievance.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { email: true, name: true } },
        category: { select: { name: true } },
      },
    });

    if (!existingGrievance) {
      return NextResponse.json(
        { success: false, error: 'Grievance not found.' },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};

    if (status) {
      const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'AWAITING_INFO', 'RESOLVED', 'CLOSED', 'REJECTED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value.' },
          { status: 400 }
        );
      }
      dataToUpdate.status = status;
    }

    if (priority) {
      const validPriorities = ['NORMAL', 'URGENT'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, error: 'Invalid priority value.' },
          { status: 400 }
        );
      }
      dataToUpdate.priority = priority;
    }

    if (assignedToId !== undefined) {
      dataToUpdate.assignedToId = assignedToId || null;
    }

    const updatedGrievance = await prisma.grievance.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    // Send email notification on status change if status changed and user email exists
    if (status && status !== existingGrievance.status && existingGrievance.user?.email) {
      try {
        await sendGrievanceStatusUpdateEmail({
          toEmail: existingGrievance.user.email,
          submitterName: existingGrievance.user.name,
          publicId: updatedGrievance.publicId,
          subject: updatedGrievance.subject,
          categoryName: existingGrievance.category.name,
          oldStatus: existingGrievance.status,
          newStatus: updatedGrievance.status,
        });
      } catch (emailError) {
        console.error('[Resend] Error sending status update email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      grievance: updatedGrievance,
      message: 'Grievance updated successfully.',
    });
  } catch (error) {
    console.error('Error updating grievance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update grievance.' },
      { status: 500 }
    );
  }
}

// 3. POST Add Internal Note or Send Public Response
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { type, text } = body; // type: 'note' | 'response'

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content text cannot be empty.' },
        { status: 400 }
      );
    }

    const cleanText = sanitizeInput(text);

    if (type === 'note') {
      const note = await prisma.adminNote.create({
        data: {
          grievanceId: params.id,
          adminId: user.id,
          note: cleanText,
        },
        include: {
          admin: { select: { id: true, name: true, role: true } },
        },
      });

      return NextResponse.json({
        success: true,
        type: 'note',
        note,
        message: 'Internal note added.',
      });
    } else if (type === 'response') {
      const response = await prisma.response.create({
        data: {
          grievanceId: params.id,
          adminId: user.id,
          message: cleanText,
          isPublic: true,
        },
        include: {
          admin: { select: { id: true, name: true } },
        },
      });

      // Optionally update status to UNDER_REVIEW if SUBMITTED
      const currentGrievance = await prisma.grievance.findUnique({
        where: { id: params.id },
        include: {
          user: { select: { email: true, name: true } },
          category: { select: { name: true } },
        },
      });

      let updatedStatus = currentGrievance?.status || 'UNDER_REVIEW';
      if (currentGrievance?.status === 'SUBMITTED') {
        updatedStatus = 'UNDER_REVIEW';
        await prisma.grievance.update({
          where: { id: params.id },
          data: { status: 'UNDER_REVIEW' },
        });
      }

      // Send email to submitter with response message
      if (currentGrievance?.user?.email) {
        try {
          await sendGrievanceStatusUpdateEmail({
            toEmail: currentGrievance.user.email,
            submitterName: currentGrievance.user.name,
            publicId: currentGrievance.publicId,
            subject: currentGrievance.subject,
            categoryName: currentGrievance.category.name,
            newStatus: updatedStatus,
            responseMessage: cleanText,
          });
        } catch (emailError) {
          console.error('[Resend] Error sending response email:', emailError);
        }
      }

      return NextResponse.json({
        success: true,
        type: 'response',
        response,
        message: 'Response published to submitter.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action type.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error posting admin note/response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}

