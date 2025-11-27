import { supabase } from "@/lib/supabase";

export const EventoMedico = {
  // FUNÇÃO QUE FALTAVA: Listar todos os eventos
  list: async () => {
    try {
      const { data, error } = await supabase
        .from('eventos_medicos')
        .select('*, pets(nome)') // Tenta trazer o nome do pet junto
        .order('data', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao listar eventos:", error);
      return [];
    }
  },

  listByPetId: async (petId) => {
    try {
      const { data, error } = await supabase
        .from('eventos_medicos')
        .select('*')
        .eq('pet_id', petId);
      return error ? [] : data;
    } catch (e) { return []; }
  },

  create: async (eventoData) => {
    try {
      // Remove campos vazios para evitar erro no banco
      const cleanData = Object.fromEntries(
        Object.entries(eventoData).filter(([_, v]) => v != null && v !== "")
      );
      
      const { data, error } = await supabase
        .from('eventos_medicos')
        .insert([cleanData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) { throw e; }
  }
};