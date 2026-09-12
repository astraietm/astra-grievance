import { prisma } from './db';

// Rate Limiter storage (in-memory for instant response + sliding window)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Basic server-side rate limiting per IP or User ID
 * @param identifier IP or User ID
 * @param limit Max requests allowed in window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(identifier: string, limit = 5, windowMs = 60000): { success: boolean; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, resetInMs: windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, resetInMs: Math.max(0, entry.resetTime - now) };
  }

  entry.count += 1;
  return { success: true, resetInMs: entry.resetTime - now };
}

/**
 * Generates sequential public Grievance ID in format GRV-YYYY-XXXX (e.g. GRV-2026-0001)
 */
export async function generatePublicGrievanceId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `GRV-${currentYear}-`;

  // Count existing grievances for current year
  const count = await prisma.grievance.count({
    where: {
      publicId: {
        startsWith: yearPrefix,
      },
    },
  });

  const nextNumber = count + 1;
  const paddedNumber = nextNumber.toString().padStart(4, '0');
  
  return `${yearPrefix}${paddedNumber}`;
}

/**
 * Sanitizes input string to prevent stored XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Allowed MIME types for file uploads
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validates uploaded file size and MIME type
 */
export function validateUploadedFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum limit of 10MB.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed formats: PDF, Images (JPG, PNG, WEBP), DOC/DOCX, TXT, and ZIP.' };
  }

  return { valid: true };
}

/**
 * Sanitizes filename to prevent directory traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.\.+/g, '.');
}
