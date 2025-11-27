import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase"; // Importando a conexão real
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2, Camera, Image as ImageIcon } from "lucide-react";

export default function PetForm({ onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    nome: "",
    tipo_animal: "",
    raca: "",
    data_nascimento: "",
    peso: "",
    cor: "",
    sexo: "",
    microchip: "",
    observacoes: "",
    castrado: false,
    foto_url: null
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null); // Referência para o input de arquivo escondido

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE UPLOAD ---
  const handleImageClick = () => {
    fileInputRef.current.click(); // Clica no input escondido
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Cria um nome único para o arquivo (ex: 17150000_rex.jpg)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Envia para o Supabase Storage (Bucket: 'pet-photos')
      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Pega a URL pública da foto enviada
      const { data } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      // 4. Atualiza o formulário com o link da foto
      setFormData(prev => ({ ...prev, foto_url: data.publicUrl }));

    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar a foto. Verifique se criou o bucket 'pet-photos' no Supabase como PÚBLICO.");
    } finally {
      setIsUploading(false);
    }
  };
  // ------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ÁREA DA FOTO DO PET */}
      <div className="flex flex-col items-center justify-center mb-6">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        
        <div 
          onClick={handleImageClick}
          className={`
            w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center 
            relative overflow-hidden group cursor-pointer transition-all
            ${formData.foto_url ? 'bg-white' : 'bg-blue-50 border-dashed border-blue-200'}
            ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400'}
          `}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : formData.foto_url ? (
             <img src={formData.foto_url} alt="Pet" className="w-full h-full object-cover" />
          ) : (
             <Camera className="w-10 h-10 text-blue-300 group-hover:text-blue-500 transition-colors" />
          )}
          
          {/* Overlay de "Trocar foto" ao passar o mouse */}
          {!isUploading && formData.foto_url && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 cursor-pointer hover:text-blue-600" onClick={handleImageClick}>
          {isUploading ? "Enviando..." : formData.foto_url ? "Trocar foto" : "Clique para adicionar foto"}
        </p>
      </div>

      {/* RESTO DO FORMULÁRIO IGUAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome do seu pet" required />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Animal *</Label>
          <Select onValueChange={(val) => handleSelectChange("tipo_animal", val)} defaultValue={formData.tipo_animal}>
            <SelectTrigger>
              <SelectValue placeholder={formData.tipo_animal || "Selecione o tipo"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cachorro">Cachorro</SelectItem>
              <SelectItem value="Gato">Gato</SelectItem>
              <SelectItem value="Ave">Ave</SelectItem>
              <SelectItem value="Peixe">Peixe</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="raca">Raça</Label>
          <Input id="raca" name="raca" value={formData.raca} onChange={handleChange} placeholder="Raça do pet" />
        </div>

        <div className="space-y-2">
          <Label>Sexo</Label>
          <Select onValueChange={(val) => handleSelectChange("sexo", val)} defaultValue={formData.sexo}>
            <SelectTrigger>
              <SelectValue placeholder={formData.sexo || "Selecione o sexo"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Fêmea">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_nascimento">Data de Nascimento</Label>
          <Input type="date" id="data_nascimento" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input type="number" id="peso" name="peso" value={formData.peso} onChange={handleChange} placeholder="Ex: 5.2" step="0.1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="microchip">Microchip</Label>
        <Input id="microchip" name="microchip" value={formData.microchip} onChange={handleChange} placeholder="Número do microchip (se houver)" />
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <Switch 
          checked={formData.castrado} 
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, castrado: checked }))} 
        />
        <Label className="cursor-pointer">Pet castrado</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
         <Button type="submit" className="w-full md:w-auto" disabled={isLoading || isUploading}>
           {isLoading || isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar Pet"}
         </Button>
      </div>
    </form>
  );
}