import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  checkRateLimit,
  generatePublicGrievanceId,
  sanitizeInput,
  validateUploadedFile,
  sanitizeFilename,
} from '@/lib/security';
import { sendGrievanceSubmissionEmail } from '@/lib/email';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Server-side authentication check
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in with Google.' },
        { status: 401 }
      );
    }

    // 2. Rate limiting check (max 5 submissions per hour per user)
    const rateLimit = checkRateLimit(`submit_${user.id}`, 5, 3600000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Submission rate limit exceeded. Please wait before submitting another grievance.' },
        { status: 429 }
      );
    }

    // 3. Parse FormData (supporting file upload)
    const formData = await req.formData();
    const categoryId = formData.get('categoryId') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const priority = (formData.get('priority') as string) || 'NORMAL';
    const wantsResponse = formData.get('wantsResponse') === 'true';
    const confirmationTruthful = formData.get('confirmationTruthful') === 'true';
    const file = formData.get('attachment') as File | null;

    // 4. Validate fields
    if (!confirmationTruthful) {
      return NextResponse.json(
        { success: false, error: 'You must confirm that the information provided is truthful and submitted in good faith.' },
        { status: 400 }
      );
    }

    if (!categoryId || !subject?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category, subject, and description are required.' },
        { status: 400 }
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'Invalid category selected.' },
        { status: 400 }
      );
    }

    // 5. Sanitize text inputs
    const cleanSubject = sanitizeInput(subject);
    const cleanDescription = sanitizeInput(description);
    const cleanPriority = ['NORMAL', 'URGENT'].includes(priority.toUpperCase())
      ? priority.toUpperCase()
      : 'NORMAL';

    // 6. Generate Unique Grievance ID (e.g. GRV-2026-0001)
    const publicGrievanceId = await generatePublicGrievanceId();

    // 7. Handle optional attachment file upload
    let attachmentData = null;
    if (file && file.size > 0) {
      const fileValidation = validateUploadedFile(file);
      if (!fileValidation.valid) {
        return NextResponse.json(
          { success: false, error: fileValidation.error },
          { status: 400 }
        );
      }

      const uploadsDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const safeOriginalFilename = sanitizeFilename(file.name);
      const uniqueFilename = `${Date.now()}_${safeOriginalFilename}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      attachmentData = {
        storagePath: uniqueFilename,
        originalFilename: safeOriginalFilename,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
      };
    }

    // 8. Create Grievance in Database
    const grievance = await prisma.grievance.create({
      data: {
        publicId: publicGrievanceId,
        userId: user.id,
        categoryId: categoryExists.id,
        subject: cleanSubject,
        description: cleanDescription,
        priority: cleanPriority,
        wantsResponse,
        confirmationTruthful,
        status: 'SUBMITTED',
        ...(attachmentData
          ? {
              attachments: {
                create: [attachmentData],
              },
            }
          : {}),
      },
    });

    // 9. Send Email Notification via Resend
    if (user.email) {
      try {
        await sendGrievanceSubmissionEmail({
          toEmail: user.email,
          submitterName: user.name,
          publicId: grievance.publicId,
          subject: grievance.subject,
          categoryName: categoryExists.name,
          status: grievance.status,
        });
      } catch (emailError) {
        console.error('[Resend] Error sending grievance submission email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      publicId: grievance.publicId,
      message: 'Grievance submitted successfully.',
    });
  } catch (error) {
    console.error('Error submitting grievance:', error);
    return NextResponse.json(
      { success: false, error: 'Your grievance could not be submitted. No changes were made. Please try again.' },
      { status: 500 }
    );
  }
}

