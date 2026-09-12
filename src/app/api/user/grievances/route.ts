import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    // Strict server-side ownership filter
    const grievances = await prisma.grievance.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        publicId: true,
        subject: true,
        priority: true,
        status: true,
        wantsResponse: true,
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
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          select: {
            id: true,
            originalFilename: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      grievances: grievances.map((g) => ({
        id: g.id,
        publicId: g.publicId,
        categoryName: g.category.name,
        subject: g.subject,
        priority: g.priority,
        status: g.status,
        wantsResponse: g.wantsResponse,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        responses: g.responses,
        attachments: g.attachments,
      })),
    });
  } catch (error) {
    console.error('Error fetching user grievances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user grievances.' },
      { status: 500 }
    );
  }
}
