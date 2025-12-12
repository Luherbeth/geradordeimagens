
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: Blob, userId: string): Promise<string | null> => {
    const fileExt = file.type.split('/')[1] || 'png';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
        .from('generated_images')
        .upload(fileName, file);

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data } = supabase.storage
        .from('generated_images')
        .getPublicUrl(fileName);

    return data.publicUrl;
};

export const saveGeneration = async (
    userId: string,
    imageUrl: string,
    prompt: string,
    options: any
) => {
    // Extract path from URL if needed, but we can store full URL or relative path.
    // Storing full URL for simplicity in frontend display.
    // Or better, store relative path to avoid domain lock-in, but publicUrl is handy.
    // Let's store the relative path for the 'image_path' column as defined in schema, 
    // but if we changed schema to 'image_url' it would be easier.
    // Actually, let's just store the public URL in 'image_path' for now, or rename col.

    // To stick to schema 'image_path', let's store the path we just uploaded:
    const path = imageUrl.split('/').pop(); // Minimal path, might need full relative path

    const { error } = await supabase
        .from('user_generations')
        .insert([
            {
                user_id: userId,
                image_path: imageUrl, // Storing full URL for easier access
                prompt: prompt,
                options: options,
            },
        ]);

    if (error) {
        console.error('Error saving generation record:', error);
        throw error;
    }
};

export const getUserHistory = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching history:', error);
        return [];
    }

    return data;
};
