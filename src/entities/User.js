import { supabase } from "@/lib/supabase";

export const User = {
  me: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "Tutor",
        foto_url: user.user_metadata?.avatar_url
      };
    }
    return null;
  },

  logout: async () => {
    await supabase.auth.signOut();
    // O ProtectedRoute vai perceber e redirecionar sozinho
  }
};