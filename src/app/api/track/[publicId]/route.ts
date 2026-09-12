import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/security';

export async function GET(
  req: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimit = checkRateLimit(`track_${ip}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many search requests. Please slow down.' },
        { status: 429 }
      );
    }

    const publicId = params.publicId?.trim().toUpperCase();
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Grievance ID is required.' },
        { status: 400 }
      );
    }

    const grievance = await prisma.grievance.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        responses: {
          where: { isPublic: true },
          select: {
            id: true,
            message: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!grievance) {
      return NextResponse.json(
        { success: false, error: "We couldn't find a grievance with that ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      grievance: {
        publicId: grievance.publicId,
        categoryName: grievance.category.name,
        subject: grievance.subject,
        status: grievance.status,
        priority: grievance.priority,
        createdAt: grievance.createdAt,
        updatedAt: grievance.updatedAt,
        responses: grievance.responses,
      },
    });
  } catch (error) {
    console.error('Error tracking grievance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve grievance status.' },
      { status: 500 }
    );
  }
}
