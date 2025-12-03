import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Calendar, Weight, Trash2 } from "lucide-react";
import { Pet } from "@/entities/Pet";

export default function PetCard({ pet, onUpdate }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEditClick = (e) => {
    e.preventDefault(); // Impede de abrir o card
    e.stopPropagation(); // Impede o clique de passar para o link
    navigate(`/editar-pet/${pet.id}`);
  };

  const handleDeleteRequest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await Pet.delete(pet.id);
      setShowConfirm(false);
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao excluir pet", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setShowConfirm(false);
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
                <img
                  src={pet.foto_url}
                  alt={pet.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PawPrint className="h-8 w-8 text-blue-300" />
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800 truncate text-lg">
                  {pet.nome}
                </h3>
              </div>

              <p className="text-sm text-gray-500 capitalize mb-2">
                {pet.tipo_animal} {pet.raca ? `• ${pet.raca}` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                {pet.castrado && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-green-100 text-green-700 px-1.5 h-5 border-0"
                  >
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

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Button
          onClick={handleEditClick}
          className="h-8 px-3 text-xs font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700"
        >
          Editar
        </Button>
        <button
          type="button"
          onClick={handleDeleteRequest}
          disabled={isDeleting}
          aria-label={`Excluir ${pet.nome}`}
          className="h-8 w-8 flex items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelDelete}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-11/12 max-w-sm p-6 space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Deseja remover <strong>{pet.nome}</strong>? Essa ação não poderá
                ser desfeita.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition disabled:opacity-70"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
