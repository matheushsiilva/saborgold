import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = 'product-images';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return null instead of throwing on load. We will check it when calls are made.
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseInstance;
}

// Export a getter/proxy for backward compatibility if needed, or helper functions
export const supabase = {
  get storage() {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not initialized. Check your environment variables.');
    }
    return client.storage;
  }
};

/**
 * Ensure the storage bucket exists. Called once before first upload.
 */
let bucketChecked = false;
async function ensureBucket() {
  if (bucketChecked) return;

  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data: buckets } = await client.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);

  if (!exists) {
    const { error } = await client.storage.createBucket(STORAGE_BUCKET, {
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

  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data: urlData } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL or path.
 */
export async function deleteFromSupabase(fileUrl: string): Promise<void> {
  const bucketPath = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = fileUrl.indexOf(bucketPath);

  if (idx === -1) {
    // Not a Supabase storage URL, skip deletion
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const filePath = decodeURIComponent(fileUrl.substring(idx + bucketPath.length));

  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error.message);
  }
}
