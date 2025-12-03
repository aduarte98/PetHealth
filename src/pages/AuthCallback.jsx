import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  loading: {
    icon: Loader2,
    iconClass: "text-blue-600 animate-spin",
    title: "Validando seu e-mail",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    title: "Conta confirmada",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600",
    title: "Não foi possível confirmar",
  },
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Estamos confirmando suas credenciais. Isso pode levar alguns segundos."
  );

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const { error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });

        if (error) throw error;

        // Garante que o usuário volte para o app deslogado e possa usar o login normal
        await supabase.auth.signOut();

        setStatus("success");
        setMessage("Tudo certo! Você já pode fazer login com seus dados.");

        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { emailVerified: true },
          });
        }, 1800);
      } catch (err) {
        console.error("Erro ao confirmar conta", err);
        setStatus("error");
        setMessage(
          "O link pode ter expirado ou já foi utilizado. Gere um novo e-mail de confirmação e tente novamente."
        );
      }
    };

    handleVerification();
  }, [navigate]);

  const { icon: Icon, iconClass, title } = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <Card className="w-full max-w-md text-center border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Icon className={`w-10 h-10 ${iconClass}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600">{message}</p>

          {status !== "loading" && (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/login", { replace: true })}
            >
              Voltar para o login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
