import { supabase } from "@/lib/supabase";

export const Pet = {
  list: async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
      return null;
    }
  },

  create: async (petData) => {
    try {
      // Remove campos vazios e nulos
      const cleanData = Object.fromEntries(
        Object.entries(petData).filter(([_, v]) => v != null && v !== "")
      );
      
      const { data, error } = await supabase
        .from('pets')
        .insert([cleanData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      throw error;
    }
  },

  // --- NOVA FUNÇÃO: ATUALIZAR ---
  update: async (id, petData) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(petData).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from('pets')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      throw error;
    }
  }
};