import { supabase } from "@/lib/supabase";
import eventEmitter from "@/components/utils/events";

const getCurrentTutorId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data?.user;
  if (!user) throw new Error("Usuário não autenticado");
  return user.id;
};

export const EventoMedico = {
  // FUNÇÃO QUE FALTAVA: Listar todos os eventos
  list: async () => {
    try {
      const tutorId = await getCurrentTutorId();
      const { data, error } = await supabase
        .from("eventos_medicos")
        .select("*, pets!inner(nome)")
        .eq("pets.tutor_id", tutorId)
        .order("data", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao listar eventos:", error);
      return [];
    }
  },

  listByPetId: async (petId) => {
    try {
      const tutorId = await getCurrentTutorId();
      const { data, error } = await supabase
        .from("eventos_medicos")
        .select("*, pets!inner(nome)")
        .eq("pet_id", petId)
        .eq("pets.tutor_id", tutorId);
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  create: async (eventoData) => {
    try {
      // Remove campos vazios para evitar erro no banco
      const cleanData = Object.fromEntries(
        Object.entries(eventoData).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from("eventos_medicos")
        .insert([cleanData])
        .select()
        .single();

      if (error) throw error;
      eventEmitter.publish("eventsUpdated");
      return data;
    } catch (e) {
      throw e;
    }
  },

  update: async (id, updates) => {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from("eventos_medicos")
        .update(cleanData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      eventEmitter.publish("eventsUpdated");
      return data;
    } catch (e) {
      throw e;
    }
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("eventos_medicos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    eventEmitter.publish("eventsUpdated");
  },
};
