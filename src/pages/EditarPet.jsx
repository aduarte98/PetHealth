import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pet } from "@/entities/Pet";
import PetForm from "@/components/pets/PetForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditarPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Carrega os dados do Pet ao abrir a página
  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    setIsLoading(true);
    const data = await Pet.getById(id);
    if (data) {
      setPet(data);
    } else {
      alert("Pet não encontrado");
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  // 2. Função que salva as alterações
  const handleUpdate = async (formData) => {
    setIsSaving(true);
    try {
      await Pet.update(id, formData);
      navigate("/dashboard"); // Volta para o dashboard após salvar
    } catch (error) {
      alert("Erro ao atualizar pet. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 mb-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Cancelar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Editar {pet.nome}</h1>
        <p className="text-gray-500">Atualize as informações ou troque a foto.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Reutiliza o formulário passando os dados atuais (initialData) */}
        <PetForm 
          initialData={pet} 
          onSubmit={handleUpdate} 
          isLoading={isSaving} 
        />
      </div>
    </div>
  );
}