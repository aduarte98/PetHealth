import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PawPrint, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Cadastro
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      } else {
        // LOGIN
        result = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      }

      if (result.error) throw result.error;

      if (isSignUp) {
        alert("Cadastro realizado! Você já pode fazer login.");
        setIsSignUp(false); // Volta para tela de login
      } else {
        navigate("/dashboard"); // Manda para o painel
      }

    } catch (error) {
      alert(error.message || "Erro na autenticação");
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
              onClick={() => setIsSignUp(!isSignUp)} 
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