import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventFilters({ 
  pets = [], // Valor padrão vazio para não quebrar
  filterType, setFilterType,
  filterPet, setFilterPet,
  filterStatus, setFilterStatus 
}) {

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilterType("todos");
    setFilterPet("todos");
    setFilterStatus("todos");
  };

  const hasActiveFilters = filterType !== "todos" || filterPet !== "todos" || filterStatus !== "todos";

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 font-medium">
        <Filter className="w-4 h-4" />
        Filtros
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="ml-auto text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Filtro de TIPO */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 ml-1">Tipo de Evento</span>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="consulta">Consulta</SelectItem>
              <SelectItem value="vacinacao">Vacinação</SelectItem>
              <SelectItem value="exame">Exame</SelectItem>
              <SelectItem value="medicamento">Medicamento</SelectItem>
              <SelectItem value="cirurgia">Cirurgia</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Filtro de PET (Protegido contra falhas) */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 ml-1">Pet</span>
          <Select value={filterPet} onValueChange={setFilterPet}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Pets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Pets</SelectItem>
              {/* Verifica se pets existe e tem itens antes de fazer o map */}
              {pets && pets.length > 0 && pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Filtro de STATUS */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 ml-1">Status</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="realizado">Realizado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}