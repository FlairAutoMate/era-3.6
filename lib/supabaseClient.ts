
import { createClient } from '@supabase/supabase-js';
import { compressImage } from '../services/imageService';

// Helper to safely access env vars
const getEnv = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
    return (window as any).process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('API_URL') || '';
const supabaseKey = getEnv('API_KEY') || '';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey && supabaseUrl !== 'https://placeholder.supabase.co';

const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(validUrl, validKey);

export const uploadFile = async (bucket: string, file: File, path: string) => {
  if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Using local object URL.");
      return URL.createObjectURL(file);
  }

  try {
      // Production Optimization: Compress image before upload
      const compressedBlob = await compressImage(file, 1600, 0.75);
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, compressedFile, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return publicUrl;
  } catch (error) {
      console.error("Upload/Compression failed:", error);
      return URL.createObjectURL(file);
  }
};
