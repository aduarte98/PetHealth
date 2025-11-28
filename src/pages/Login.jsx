import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertMessage } from "@/components/ui/alert-message";
import { PawPrint, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Cadastro
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 10000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const getAuthErrorMessage = (error) => {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("invalid login credentials")) {
      return "E-mail ou senha inválidos.";
    }
    if (message.includes("password should be at least 6 characters")) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (message.includes("email not confirmed")) {
      return "Confirme seu e-mail para acessar.";
    }
    if (message.includes("user already registered") || message.includes("already registered")) {
      return "Este e-mail já possui uma conta cadastrada.";
    }
    return "Não foi possível autenticar. Verifique os dados e tente novamente.";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (isSignUp && formData.password.length < 6) {
      setFeedback({ type: "error", message: "A senha precisa ter no mínimo 6 caracteres." });
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isSignUp) {
        // CADASTRO
        result = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.email.split('@')[0] } // Usa parte do email como nome inicial
          }
        });

        const noIdentities = !result.data?.user?.identities || result.data.user.identities.length === 0;
        if (noIdentities) {
          setFeedback({ type: "error", message: "Este e-mail já possui uma conta cadastrada." });
          setLoading(false);
          return;
        }
      } else {
        // LOGIN
        result = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      }

      if (result.error) throw result.error;

      if (isSignUp) {
        setFeedback({ type: "success", message: "Cadastro realizado! Você já pode fazer login." });
        setIsSignUp(false); // Volta para tela de login
      } else {
        navigate("/dashboard"); // Manda para o painel
      }

    } catch (error) {
      setFeedback({ type: "error", message: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-blue-900">
            {isSignUp ? "Criar Conta" : "Bem-vindo ao PetPal"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {isSignUp ? "Preencha os dados para começar" : "Entre para gerenciar seus pets"}
          </p>
        </CardHeader>
        <CardContent>
          {feedback && (
            <div className="mb-4">
              <AlertMessage
                variant={feedback.type}
                message={feedback.message}
                onClose={() => setFeedback(null)}
              />
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="seu@email.com" 
                required 
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Cadastrar" : "Entrar")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? "Já tem uma conta? " : "Não tem conta? "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFeedback(null);
              }} 
              className="text-blue-600 font-bold hover:underline"
            >
              {isSignUp ? "Fazer Login" : "Cadastre-se"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}