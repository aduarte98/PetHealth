import { useState, useEffect } from 'react';
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function TutorForm({ user, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    foto_url: '',
    telefone: '',
    endereco: '',
    ...user
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, ...user }));
    }
  }, [user]);

  const formatPhone = (raw) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    const parts = [];
    if (digits.length > 0) {
      parts.push("(" + digits.slice(0, 2));
      if (digits.length >= 2) parts[0] += ")";
    }
    if (digits.length > 2) {
      const middle = digits.length > 7
        ? digits.slice(2, 7)
        : digits.slice(2, 6);
      parts.push(" " + middle);
    }
    if (digits.length > 7) {
      parts.push("-" + digits.slice(7));
    } else if (digits.length > 6) {
      parts.push("-" + digits.slice(6));
    }
    return parts.join("").trim();
  };

  const handleInputChange = (field, value) => {
    let nextValue = value;
    if (field === 'telefone') {
      nextValue = formatPhone(value);
    }
    setFormData(prev => ({
      ...prev,
      [field]: nextValue
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange('foto_url', file_url);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
    setUploadingPhoto(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="relative inline-block">
          <img 
            src={formData.foto_url || `https://ui-avatars.com/api/?name=${formData.full_name}&background=E0F2F1&color=1E88E5`}
            alt="Foto do Tutor" 
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
            {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            <input 
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-gray-700 font-medium">Nome Completo</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

       <div className="space-y-2">
          <Label htmlFor="telefone" className="text-gray-700 font-medium">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone || ''}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            inputMode="tel"
            maxLength={16}
          />
        </div>

      <div className="space-y-2">
        <Label htmlFor="endereco" className="text-gray-700 font-medium">Endereço</Label>
        <Textarea
          id="endereco"
          value={formData.endereco || ''}
          onChange={(e) => handleInputChange('endereco', e.target.value)}
          placeholder="Seu endereço completo"
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
             <Save className="w-4 h-4 mr-2" />
             Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}