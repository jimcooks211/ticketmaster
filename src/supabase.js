import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lzhehowjxhsjtguedayo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xoN7nii3StZ-3iQUKa_0LA_sPyIUUYJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Upload an event image to Supabase Storage and return its public URL.
// The bucket "event-images" must exist and be set to Public in your Supabase dashboard.
export const uploadEventImage = async (file) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) throw new Error('Image upload failed: ' + error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export default supabase;
