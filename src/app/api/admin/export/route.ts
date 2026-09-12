import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const includeIdentity = searchParams.get('includeIdentity') === 'true';
    const reason = searchParams.get('reason');

    let canIncludeIdentity = false;

    if (includeIdentity) {
      if (user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Only SUPER_ADMIN can export identity details.' },
          { status: 403 }
        );
      }
      if (!reason || !reason.trim()) {
        return NextResponse.json(
          { success: false, error: 'Mandatory justification reason required for identity export.' },
          { status: 400 }
        );
      }
      canIncludeIdentity = true;
    }

    const grievances = await prisma.grievance.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        user: true,
        assignedTo: true,
      },
    });

    if (canIncludeIdentity && reason && grievances.length > 0) {
      await Promise.all(
        grievances.map((g) =>
          prisma.identityAccessLog.create({
            data: {
              grievanceId: g.id,
              adminId: user.id,
              reason: `[BULK EXPORT] ${sanitizeInput(reason)}`,
            },
          })
        )
      );
    }

    // Generate CSV
    const headers = [
      'Grievance ID',
      'Category',
      'Subject',
      'Priority',
      'Status',
      'Wants Response',
      'Submitted Date',
      'Assigned To',
    ];

    if (canIncludeIdentity) {
      headers.push('Complainant Name', 'Complainant Email', 'Department');
    }

    const rows = grievances.map((g) => {
      const row = [
        `"${g.publicId}"`,
        `"${g.category.name.replace(/"/g, '""')}"`,
        `"${g.subject.replace(/"/g, '""')}"`,
        `"${g.priority}"`,
        `"${g.status}"`,
        `"${g.wantsResponse ? 'Yes' : 'No'}"`,
        `"${new Date(g.createdAt).toISOString()}"`,
        `"${(g.assignedTo?.name || 'Unassigned').replace(/"/g, '""')}"`,
      ];

      if (canIncludeIdentity) {
        row.push(
          `"${(g.user.name || '').replace(/"/g, '""')}"`,
          `"${(g.user.email || '').replace(/"/g, '""')}"`,
          `"${(g.user.department || 'Cyber Security').replace(/"/g, '""')}"`
        );
      }

      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ASTRA_Grievances_Export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting grievances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export grievances.' },
      { status: 500 }
    );
  }
}
