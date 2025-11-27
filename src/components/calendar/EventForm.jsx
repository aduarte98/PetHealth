import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Save } from "lucide-react";

export default function EventForm({ evento, pets, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(evento || {
    pet_id: '',
    tipo: 'consulta',
    titulo: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    hora: '',
    veterinario: '',
    clinica: '',
    status: 'agendado',
    observacoes: '',
    preco: '',
    lembrete: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      preco: formData.preco ? Number(formData.preco) : undefined
    };
    onSubmit(processedData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {evento ? 'Editar Evento' : 'Novo Evento'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pet_id" className="text-gray-700 font-medium">Pet *</Label>
            <Select
              value={formData.pet_id}
              onValueChange={(value) => handleInputChange('pet_id', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.nome} ({pet.tipo_animal})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-gray-700 font-medium">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => handleInputChange('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">🩺 Consulta</SelectItem>
                <SelectItem value="vacinacao">💉 Vacinação</SelectItem>
                <SelectItem value="exame">🔬 Exame</SelectItem>
                <SelectItem value="cirurgia">🏥 Cirurgia</SelectItem>
                <SelectItem value="medicamento">💊 Medicamento</SelectItem>
                <SelectItem value="outro">📋 Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="titulo" className="text-gray-700 font-medium">Título *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            placeholder="Ex: Consulta de rotina, Vacina antirrábica..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data" className="text-gray-700 font-medium">Data *</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora" className="text-gray-700 font-medium">Horário</Label>
            <Input
              id="hora"
              type="time"
              value={formData.hora}
              onChange={(e) => handleInputChange('hora', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="veterinario" className="text-gray-700 font-medium">Veterinário</Label>
            <Input
              id="veterinario"
              value={formData.veterinario}
              onChange={(e) => handleInputChange('veterinario', e.target.value)}
              placeholder="Nome do veterinário"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinica" className="text-gray-700 font-medium">Clínica</Label>
            <Input
              id="clinica"
              value={formData.clinica}
              onChange={(e) => handleInputChange('clinica', e.target.value)}
              placeholder="Nome da clínica"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">⏳ Agendado</SelectItem>
                <SelectItem value="realizado">✅ Realizado</SelectItem>
                <SelectItem value="cancelado">❌ Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco" className="text-gray-700 font-medium">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              min="0"
              step="0.01"
              value={formData.preco}
              onChange={(e) => handleInputChange('preco', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-gray-700 font-medium">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Detalhes sobre o evento..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-gray-700 font-medium">Observações</Label>
          <Textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            placeholder="Observações adicionais..."
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="lembrete"
            checked={formData.lembrete}
            onCheckedChange={(checked) => handleInputChange('lembrete', checked)}
          />
          <Label htmlFor="lembrete" className="text-gray-700 font-medium">
            Ativar lembrete
          </Label>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            disabled={!formData.pet_id || !formData.titulo || !formData.data}
          >
            <Save className="w-4 h-4 mr-2" />
            {evento ? 'Atualizar' : 'Criar'} Evento
          </Button>
        </div>
      </form>
    </div>
  );
}