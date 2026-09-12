import { getSupabaseAdmin } from './supabase';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'grievance-attachments';

/**
 * Uploads a file buffer to Supabase Storage if configured.
 * Returns the storage path if uploaded to Supabase, or null if Supabase Storage is unavailable.
 */
export async function uploadToSupabaseStorage(
  storagePath: string,
  buffer: Buffer,
  contentType: string
): Promise<string | null> {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return null;

  try {
    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase Storage upload warning:', error.message);
      return null;
    }

    return data?.path || storagePath;
  } catch (err) {
    console.warn('Supabase Storage upload failed:', err);
    return null;
  }
}

/**
 * Downloads a file buffer from Supabase Storage.
 * Returns Buffer if successful, or null if file not found or Supabase unavailable.
 */
export async function downloadFromSupabaseStorage(storagePath: string): Promise<Buffer | null> {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return null;

  try {
    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .download(storagePath);

    if (error || !data) {
      console.warn('Supabase Storage download error:', error?.message);
      return null;
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn('Supabase Storage download failed:', err);
    return null;
  }
}
