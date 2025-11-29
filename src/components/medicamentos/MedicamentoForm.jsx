import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MedicamentoForm({
  medicamento,
  pets,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const createDefaultFormData = () => ({
    pet_id: "",
    nome_medicamento: "",
    dosagem: "",
    horarios: "",
    data_inicio: new Date().toISOString().split("T")[0],
    duracao_dias: 7,
    instrucoes: "",
    status: "ativo",
  });

  const [formData, setFormData] = useState(createDefaultFormData);

  useEffect(() => {
    if (medicamento) {
      setFormData({
        pet_id: medicamento.pet_id != null ? String(medicamento.pet_id) : "",
        nome_medicamento: medicamento.nome_medicamento ?? "",
        dosagem: medicamento.dosagem ?? "",
        horarios: medicamento.horarios ?? "",
        data_inicio: medicamento.data_inicio
          ? new Date(medicamento.data_inicio).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        duracao_dias: medicamento.duracao_dias ?? 7,
        instrucoes: medicamento.instrucoes ?? "",
        status: medicamento.status ?? "ativo",
      });
    } else {
      setFormData(createDefaultFormData());
    }
  }, [medicamento]);

  const selectedPet = pets.find((pet) => pet.id === formData.pet_id);
  const petLabel = selectedPet ? selectedPet.nome : "Selecione o pet";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      pet_id:
        Number(formData.pet_id).toString() === formData.pet_id
          ? Number(formData.pet_id)
          : formData.pet_id,
      nome_medicamento: formData.nome_medicamento,
      dosagem: formData.dosagem,
      horarios: formData.horarios,
      data_inicio: formData.data_inicio,
      duracao_dias: Number(formData.duracao_dias) || 0,
      instrucoes: formData.instrucoes,
      status: formData.status,
    };
    onSubmit(processedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {medicamento ? "Editar Tratamento" : "Novo Tratamento"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pet_id" className="font-medium">
            Pet *
          </Label>
          <Select
            value={formData.pet_id ?? ""}
            onValueChange={(value) => handleInputChange("pet_id", value)}
            required
          >
            <SelectTrigger>
              <span className="block truncate text-left">{petLabel}</span>
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={String(pet.id)}>
                  {pet.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nome_medicamento" className="font-medium">
            Nome do Medicamento *
          </Label>
          <Input
            id="nome_medicamento"
            value={formData.nome_medicamento}
            onChange={(e) =>
              handleInputChange("nome_medicamento", e.target.value)
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dosagem" className="font-medium">
              Dosagem *
            </Label>
            <Input
              id="dosagem"
              value={formData.dosagem}
              placeholder="Ex: 1 comprimido"
              onChange={(e) => handleInputChange("dosagem", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horarios" className="font-medium">
              Horários *
            </Label>
            <Input
              id="horarios"
              value={formData.horarios}
              placeholder="Ex: 08:00, 20:00"
              onChange={(e) => handleInputChange("horarios", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_inicio" className="font-medium">
              Data de Início *
            </Label>
            <Input
              id="data_inicio"
              type="date"
              value={formData.data_inicio}
              onChange={(e) => handleInputChange("data_inicio", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duracao_dias" className="font-medium">
              Duração (dias) *
            </Label>
            <Input
              id="duracao_dias"
              type="number"
              min="1"
              value={formData.duracao_dias}
              onChange={(e) =>
                handleInputChange("duracao_dias", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instrucoes" className="font-medium">
            Instruções Adicionais
          </Label>
          <Textarea
            id="instrucoes"
            value={formData.instrucoes}
            placeholder="Ex: Administrar com alimentos"
            onChange={(e) => handleInputChange("instrucoes", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-green-600"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {medicamento ? "Salvar Alterações" : "Adicionar"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
