import { supabase } from "@/lib/supabase";

export const User = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "Tutor",
        foto_url: user.user_metadata?.foto_url || user.user_metadata?.avatar_url || null,
        telefone: user.user_metadata?.telefone || "",
        endereco: user.user_metadata?.endereco || ""
      };
    }
    return null;
  },

  updateMyUserData: async ({ full_name, data = {} }) => {
    const payload = {
      data: {
        full_name,
        ...data
      }
    };

    const { data: response, error } = await supabase.auth.updateUser(payload);
    if (error) throw error;

    const updatedUser = response.user;
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.user_metadata?.full_name || full_name,
      foto_url: updatedUser.user_metadata?.foto_url || updatedUser.user_metadata?.avatar_url || null,
      telefone: updatedUser.user_metadata?.telefone || "",
      endereco: updatedUser.user_metadata?.endereco || ""
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
    // O ProtectedRoute vai perceber e redirecionar sozinho
  }
};