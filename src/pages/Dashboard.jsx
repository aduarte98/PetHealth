import React, { useState, useEffect } from "react";
import { Pet } from "@/entities/Pet";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, PawPrint, Heart, Calendar, Weight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PetCard from "../components/pets/PetCard";
import StatsCards from "../components/dashboard/StatsCards";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadPets();
    // Use location.key para garantir que o recarregamento aconteça
    // sempre que a Dashboard for acessada após uma navegação,
    // incluindo ao voltar da página de detalhes.
  }, [location.key]); 

  const loadPets = async () => {
    setIsLoading(true);
    const data = await Pet.list("-created_date");
    setPets(data);
    setIsLoading(false);
  };

  const getStats = () => {
    const totalPets = pets.length;
    const tipos = pets.reduce((acc, pet) => {
      acc[pet.tipo_animal] = (acc[pet.tipo_animal] || 0) + 1;
      return acc;
    }, {});
    const tipoMaisComum = Object.entries(tipos).sort(([,a], [,b]) => b - a)[0];
    const idadeMedia = pets.length > 0 ? 
      (pets.reduce((sum, pet) => sum + (pet.idade || 0), 0) / pets.length).toFixed(1) : 0;

    return {
      total: totalPets,
      tipoComum: tipoMaisComum ? tipoMaisComum[0] : 'Nenhum',
      idadeMedia: idadeMedia
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-3 sm:p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
            >
              Meus Pets
            </motion.h1>
            <p className="text-gray-600">Gerencie a saúde e bem-estar dos seus companheiros</p>
          </div>
          <Link to={createPageUrl("AdicionarPet")} className="w-full md:w-auto">
            <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] text-base">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Pet
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatsCards 
            title="Total de Pets" 
            value={stats.total}
            icon={PawPrint}
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCards 
            title="Tipo Mais Comum" 
            value={stats.tipoComum}
            icon={Heart}
            gradient="from-green-500 to-green-600"
          />
          <StatsCards 
            title="Idade Média" 
            value={`${stats.idadeMedia} anos`}
            icon={Calendar}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Pets Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seus Companheiros</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : pets.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum pet cadastrado ainda</h3>
              <p className="text-gray-500 mb-6">Comece adicionando seu primeiro companheiro!</p>
              <Link to={createPageUrl("AdicionarPet")}>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Primeiro Pet
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {pets.map((pet, index) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PetCard pet={pet} onUpdate={loadPets} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}