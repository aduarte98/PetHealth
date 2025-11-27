import React, { useState, useEffect } from "react";
import { Medicamento } from "@/entities/Medicamento";
import { Pet } from "@/entities/Pet";
import _ from 'lodash';
import { Button } from "@/components/ui/button";
import { Plus, Pill, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MedicamentoForm from "../components/medicamentos/MedicamentoForm";
import MedicamentoCard from "../components/medicamentos/MedicamentoCard";

export default function GestaoDeMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicamento, setEditingMedicamento] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [medicamentosData, petsData] = await Promise.all([
        Medicamento.list("-created_date"),
        Pet.list("nome")
      ]);
      setMedicamentos(medicamentosData);
      setPets(petsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingMedicamento) {
        await Medicamento.update(editingMedicamento.id, data);
      } else {
        await Medicamento.create(data);
      }
      setShowForm(false);
      setEditingMedicamento(null);
      await loadData();
    } catch (error) {
      console.error("Erro ao salvar medicamento:", error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = (medicamento) => {
    setEditingMedicamento(medicamento);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await Medicamento.delete(id);
      await loadData();
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await Medicamento.update(id, { status });
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };
  
  const getPetName = (petId) => pets.find(p => p.id === petId)?.nome || "Pet desconhecido";
  const medicamentosAgrupados = _.groupBy(medicamentos, 'pet_id');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-3 sm:p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Gestão de Medicamentos</h1>
              <p className="text-gray-600">Acompanhe os tratamentos de todos os seus pets.</p>
            </div>
            <Button onClick={() => { setEditingMedicamento(null); setShowForm(true); }} className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 min-h-[48px] text-base">
              <Plus className="w-5 h-5 mr-2" />
              Novo Tratamento
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-16"><Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" /></div>
          ) : medicamentos.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-xl">
              <Pill className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Nenhum tratamento em andamento.</h3>
              <p className="text-gray-500 mt-2">Adicione o primeiro medicamento para começar a monitorar.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(medicamentosAgrupados).map(([petId, meds]) => (
                <div key={petId}>
                  <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-blue-200 pb-2">
                    {getPetName(petId)}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {meds.map(med => (
                      <MedicamentoCard
                        key={med.id}
                        medicamento={med}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <MedicamentoForm
                medicamento={editingMedicamento}
                pets={pets}
                onSubmit={handleSave}
                onCancel={() => { setShowForm(false); setEditingMedicamento(null); }}
                isSubmitting={isSubmitting}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}