import { supabase } from "@/lib/supabase";

const getCurrentTutorId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data?.user;
  if (!user) throw new Error("Usuário não autenticado");
  return user.id;
};

const applyOrdering = (query, order = "-created_at") => {
  if (!order || typeof order !== "string") {
    return query.order("created_at", { ascending: false });
  }

  const isDesc = order.startsWith("-");
  const rawField = order.replace(/^-/, "").trim() || "created_at";
  const field = rawField === "created_date" ? "created_at" : rawField;

  return query.order(field, { ascending: !isDesc });
};

export const Pet = {
  list: async (order = "-created_at") => {
    try {
      const tutorId = await getCurrentTutorId();
      const query = supabase.from("pets").select("*").eq("tutor_id", tutorId);

      const { data, error } = await applyOrdering(query, order);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const tutorId = await getCurrentTutorId();
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .eq("tutor_id", tutorId)
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
      const tutorId = await getCurrentTutorId();
      // Remove campos vazios e nulos
      const cleanData = Object.fromEntries(
        Object.entries(petData).filter(([_, v]) => v != null && v !== "")
      );
      cleanData.tutor_id = tutorId;

      const { data, error } = await supabase
        .from("pets")
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
      const tutorId = await getCurrentTutorId();
      const cleanData = Object.fromEntries(
        Object.entries(petData).filter(([_, v]) => v != null && v !== "")
      );

      const { data, error } = await supabase
        .from("pets")
        .update(cleanData)
        .eq("id", id)
        .eq("tutor_id", tutorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const tutorId = await getCurrentTutorId();
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id)
        .eq("tutor_id", tutorId);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      throw error;
    }
  },
};
