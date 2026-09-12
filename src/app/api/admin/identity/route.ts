import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // Strict SUPER_ADMIN check
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied. Only SUPER_ADMIN accounts can request complainant identity.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { grievanceId, reason } = body;

    if (!grievanceId || !reason || !reason.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'A valid grievance ID and mandatory justification reason are required to unlock identity.',
        },
        { status: 400 }
      );
    }

    const cleanReason = sanitizeInput(reason);

    const grievance = await prisma.grievance.findUnique({
      where: { id: grievanceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            year: true,
            createdAt: true,
          },
        },
      },
    });

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: 'Grievance not found.' },
        { status: 404 }
      );
    }

    // Write audit log entry
    await prisma.identityAccessLog.create({
      data: {
        grievanceId: grievance.id,
        adminId: user.id,
        reason: cleanReason,
      },
    });

    return NextResponse.json({
      success: true,
      complainantIdentity: {
        id: grievance.user.id,
        name: grievance.user.name || 'Anonymous Student',
        email: grievance.user.email,
        department: grievance.user.department || 'Cyber Security',
        year: grievance.user.year || 'N/A',
        userSince: grievance.user.createdAt,
      },
      auditLogCreated: true,
      accessedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error unlocking complainant identity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to access identity.' },
      { status: 500 }
    );
  }
}
