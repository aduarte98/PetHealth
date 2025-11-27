import React, { useState, useEffect } from "react";
import { EventoMedico } from "@/entities/EventoMedico";
import { Pet } from "@/entities/Pet";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CalendarGrid from "../components/calendar/CalendarGrid";
import EventList from "../components/calendar/EventList";
import EventForm from "../components/calendar/EventForm";
import EventFilters from "../components/calendar/EventFilters";

export default function Calendario() {
  const [events, setEvents] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("todos");
  const [filterPet, setFilterPet] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, petsData] = await Promise.all([
        EventoMedico.list(),
        Pet.list()
      ]);
      setEvents(eventsData);
      setPets(petsData);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (formData) => {
    try {
      await EventoMedico.create(formData);
      await loadData(); // Recarrega tudo
      setIsFormOpen(false);
    } catch (error) {
      alert("Erro ao salvar evento");
    }
  };

  // --- A CORREÇÃO MÁGICA ESTÁ AQUI ---
  // Filtra os eventos para o dia clicado
  const getEventsForSelectedDate = () => {
    // Formata a data selecionada para YYYY-MM-DD (igual ao banco)
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    return events.filter(event => {
      // 1. Verifica se é o dia certo
      const isSameDay = event.data === dateString;
      
      if (!isSameDay) return false;

      // 2. Aplica os filtros visuais (Tipo, Pet, Status)
      if (filterType !== "todos" && event.tipo !== filterType) return false;
      if (filterPet !== "todos" && event.pet_id !== filterPet) return false;
      if (filterStatus !== "todos" && event.status !== filterStatus) return false;

      return true;
    });
  };

  const selectedDayEvents = getEventsForSelectedDate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Calendário de Cuidados
          </h1>
          <p className="text-gray-500">Organize consultas, vacinas e cuidados dos seus pets</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Novo Evento
        </Button>
      </div>

      {/* Filtros */}
      <EventFilters 
        pets={pets}
        filterType={filterType} setFilterType={setFilterType}
        filterPet={filterPet} setFilterPet={setFilterPet}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda: O Calendário Visual */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <CalendarGrid 
            events={events} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} // Passa a função de clicar
          />
        </div>

        {/* Coluna da Direita: Lista do Dia */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit min-h-[400px]">
          <h3 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2">
            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          
          {isLoading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <EventList events={selectedDayEvents} />
          )}
        </div>
      </div>

      {/* Modal de Adicionar Evento */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <EventForm 
                pets={pets} 
                initialDate={selectedDate}
                onSubmit={handleAddEvent} 
                onCancel={() => setIsFormOpen(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}