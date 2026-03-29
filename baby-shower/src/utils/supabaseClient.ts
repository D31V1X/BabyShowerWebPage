import { createClient } from '@supabase/supabase-js';

// Reemplazar con las variables de entorno reales más adelante
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Gift = {
  id: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  tienda_url: string;
  comprado: boolean;
  created_at?: string;
};
