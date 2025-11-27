import { createClient } from '@supabase/supabase-js';

// Pega as chaves do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// A CORREÇÃO ESTÁ AQUI: Usamos "export const" para o nome ser exato
export const supabase = createClient(supabaseUrl, supabaseKey);