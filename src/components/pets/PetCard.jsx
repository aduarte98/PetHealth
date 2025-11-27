import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Calendar, Weight } from "lucide-react";

export default function PetCard({ pet }) {
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault(); // Impede de abrir o card
    e.stopPropagation(); // Impede o clique de passar para o link
    navigate(`/editar-pet/${pet.id}`);
  };

  return (
    <div className="relative group h-full">
      {/* O Card inteiro é o Link para detalhes */}
      <Link to={`/pet/${pet.id}`} className="block h-full">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500 h-full">
          <CardContent className="p-4 flex items-center gap-4">
            
            {/* Foto do Pet */}
            <div className="h-16 w-16 rounded-full bg-blue-50 flex-shrink-0 overflow-hidden border border-blue-100 flex items-center justify-center">
              {pet.foto_url ? (
                <img src={pet.foto_url} alt={pet.nome} className="h-full w-full object-cover" />
              ) : (
                <PawPrint className="h-8 w-8 text-blue-300" />
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800 truncate text-lg">{pet.nome}</h3>
              </div>
              
              <p className="text-sm text-gray-500 capitalize mb-2">
                {pet.tipo_animal} {pet.raca ? `• ${pet.raca}` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                {pet.castrado && (
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 px-1.5 h-5 border-0">
                    Castrado
                  </Badge>
                )}
                {/* REMOVIDO: Mini card com "? anos" */}
                {pet.idade && ( // Apenas mostra se a idade existir
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    <Calendar className="w-3 h-3" /> {pet.idade} anos
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* BOTÃO EDITAR COM TEXTO E ESTILO AZUL/BRANCO */}
      <Button 
        onClick={handleEditClick}
        // Classes para botão azul, texto branco, e hover
        className="absolute top-4 right-4 z-20 h-8 px-3 text-xs font-bold 
                   bg-blue-600 text-white shadow-md hover:bg-blue-700"
      >
        Editar
      </Button>
    </div>
  );
}