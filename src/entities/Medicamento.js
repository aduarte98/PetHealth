import { supabase } from "@/lib/supabase";

export const Medicamento = {
  // FUNÇÃO QUE FALTAVA: Listar todos os medicamentos
  list: async () => {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .select('*, pets(nome)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao listar medicamentos:", error);
      return [];
    }
  },

  listByPetId: async (petId) => {
    try {
      const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .eq('pet_id', petId);
      return error ? [] : data;
    } catch (e) { return []; }
  },

  create: async (medData) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(medData).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from('medicamentos')
        .insert([cleanData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (e) { throw e; }
  },

  update: async (id, updates) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from('medicamentos')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) { throw e; }
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('medicamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};