import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: params.id },
      include: {
        grievance: true,
      },
    });

    if (!attachment) {
      return NextResponse.json(
        { success: false, error: 'Attachment not found.' },
        { status: 404 }
      );
    }

    // Check authorization: Owner or Admin
    const isOwner = attachment.grievance.userId === user.id;
    const isAdmin = ['REVIEWER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role);

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this attachment.' },
        { status: 403 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, attachment.storagePath);

    // Check file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'File no longer exists on server.' },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': attachment.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${attachment.originalFilename}"`,
        'Content-Length': attachment.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving attachment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve attachment.' },
      { status: 500 }
    );
  }
}
