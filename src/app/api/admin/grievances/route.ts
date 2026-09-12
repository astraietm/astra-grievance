import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this page.' },
        { status: 403 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { publicId: { contains: q } },
        { subject: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' as const } : { createdAt: 'desc' as const };

    const grievances = await prisma.grievance.findMany({
      where,
      orderBy,
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
            id: true,
            name: true,
            slug: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            attachments: true,
            adminNotes: true,
            responses: true,
          },
        },
      },
    });

    // Count statistics
    const stats = {
      total: await prisma.grievance.count(),
      new: await prisma.grievance.count({ where: { status: 'SUBMITTED' } }),
      underReview: await prisma.grievance.count({ where: { status: 'UNDER_REVIEW' } }),
      inProgress: await prisma.grievance.count({ where: { status: 'IN_PROGRESS' } }),
      resolved: await prisma.grievance.count({ where: { status: 'RESOLVED' } }),
      closed: await prisma.grievance.count({ where: { status: 'CLOSED' } }),
    };

    return NextResponse.json({
      success: true,
      stats,
      userRole: user.role,
      grievances: grievances.map((g) => ({
        id: g.id,
        publicId: g.publicId,
        categoryName: g.category.name,
        categorySlug: g.category.slug,
        subject: g.subject,
        priority: g.priority,
        status: g.status,
        wantsResponse: g.wantsResponse,
        assignedTo: g.assignedTo?.name || 'Unassigned',
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        attachmentCount: g._count.attachments,
        noteCount: g._count.adminNotes,
        responseCount: g._count.responses,
        identityRestricted: true, // Submitter identity hidden by default
      })),
    });
  } catch (error) {
    console.error('Error fetching admin grievances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin grievances.' },
      { status: 500 }
    );
  }
}
