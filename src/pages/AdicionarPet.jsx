import { useState } from "react";
import { Pet } from "@/entities/Pet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import PetForm from "../components/pets/PetForm";

export default function AdicionarPet() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (petData) => {
    setIsSubmitting(true);
    try {
      await Pet.create(petData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Erro ao criar pet:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold text-gray-800"
            >
              Adicionar Novo Pet
            </motion.h1>
            <p className="text-gray-600 mt-1">Cadastre seu companheiro e mantenha as informações organizadas</p>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl text-gray-800">Informações do Pet</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PetForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => navigate(createPageUrl("Dashboard"))}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}