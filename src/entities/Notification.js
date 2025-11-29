import { supabase } from "@/lib/supabase";

const getCurrentTutorId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado");
  return user.id;
};

const normalizeNotification = (row) => ({
  id: row.id,
  title: row.title ?? "Notificação",
  message: row.message ?? row.msg ?? "",
  type: row.type ?? "info",
  read_at: Object.prototype.hasOwnProperty.call(row, "read_at")
    ? row.read_at
    : undefined,
  created_at: row.created_at ?? row.time ?? null,
});

export const Notification = {
  async list() {
    const tutorId = await getCurrentTutorId();
    const baseQuery = () =>
      supabase.from("notifications").select("*").eq("tutor_id", tutorId);

    const { data, error } = await baseQuery().order("created_at", {
      ascending: false,
    });

    if (error) {
      if (error.code === "42703") {
        const fallback = await baseQuery();
        if (!fallback.error) {
          return (fallback.data || []).map(normalizeNotification);
        }
      }

      if (error.code === "42P01") {
        console.warn(
          "Tabela 'notifications' não encontrada. Retornando lista vazia."
        );
        return [];
      }

      throw error;
    }

    return (data || []).map(normalizeNotification);
  },

  async markAsRead(notificationId) {
    const tutorId = await getCurrentTutorId();
    return supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("tutor_id", tutorId);
  },

  async markAllAsRead() {
    const tutorId = await getCurrentTutorId();
    return supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("tutor_id", tutorId)
      .is("read_at", null);
  },

  async remove(notificationId) {
    const tutorId = await getCurrentTutorId();
    return supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("tutor_id", tutorId);
  },
};
