import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role key on server for full storage access (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const STORAGE_BUCKET = 'product-images';

/**
 * Ensure the storage bucket exists. Called once before first upload.
 */
let bucketChecked = false;
async function ensureBucket() {
  if (bucketChecked) return;

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });
    if (error && !error.message.includes('already exists')) {
      console.error('Failed to create storage bucket:', error.message);
    }
  }

  bucketChecked = true;
}

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToSupabase(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  await ensureBucket();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL or path.
 */
export async function deleteFromSupabase(fileUrl: string): Promise<void> {
  // Extract the file path from the full URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/product-images/<filename>
  const bucketPath = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = fileUrl.indexOf(bucketPath);

  if (idx === -1) {
    // Not a Supabase storage URL, skip deletion
    return;
  }

  const filePath = decodeURIComponent(fileUrl.substring(idx + bucketPath.length));

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error.message);
  }
}
