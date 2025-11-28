import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pet } from "@/entities/Pet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Calendar, Weight, Activity, MapPin } from "lucide-react";
import WeightChart from "../components/pets/WeightChart";
import { differenceInYears } from "date-fns";

export default function PetDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [events, setEvents] = useState([]);
  const [weights, setWeights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 1. Dados do Pet
        const petData = await Pet.getById(id);
        setPet(petData);

        // 2. Últimos 5 Eventos (Consultas/Vacinas)
        const { data: eventsData } = await supabase
          .from('eventos_medicos')
          .select('*')
          .eq('pet_id', id)
          .order('data', { ascending: false })
          .limit(5);
        setEvents(eventsData || []);

        // 3. Histórico de Peso (Para o gráfico)
        const { data: weightData } = await supabase
          .from('pesos')
          .select('*')
          .eq('pet_id', id)
          .order('data_pesagem', { ascending: true });
        setWeights(weightData || []);

      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const getAgeLabel = () => {
    if (!pet) return "-";
    if (pet.idade || pet.idade === 0) {
      return `${pet.idade} anos`;
    }
    if (pet.data_nascimento) {
      const nascimento = new Date(pet.data_nascimento);
      if (!isNaN(nascimento)) {
        const anos = Math.max(0, differenceInYears(new Date(), nascimento));
        return `${anos} anos`;
      }
    }
    return "Sem registro";
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!pet) return <div className="p-10 text-center">Pet não encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header com Botão Voltar */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Detalhes do Pet</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUNA 1: CARTÃO DE INFORMAÇÕES (PERFIL) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-blue-50 overflow-hidden mb-4 border-4 border-white shadow-lg">
              {pet.foto_url ? (
                <img src={pet.foto_url} alt={pet.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-300">Sem Foto</div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{pet.nome}</h2>
            <p className="text-sm text-gray-500 capitalize">{pet.tipo_animal} • {pet.raca || "SRD"}</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Idade</p>
                <p className="font-semibold text-gray-700">{getAgeLabel()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Peso Atual</p>
                <p className="font-semibold text-gray-700">{pet.peso || "?"} kg</p>
              </div>
            </div>
          </div>

          {/* Card de Alergias */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h3 className="text-xs font-bold text-red-800 uppercase mb-2">Alergias & Restrições</h3>
            <p className="text-sm text-red-700">{pet.alergias || "Nenhuma alergia registrada."}</p>
          </div>
        </div>

        {/* COLUNA 2 & 3: GRÁFICO E HISTÓRICO */}
        <div className="md:col-span-2 space-y-6">
          
          {/* O Gráfico Pequeno */}
          <WeightChart data={weights} />

          {/* Lista de Eventos Linkados */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Histórico Recente
              </h3>
              <Button variant="ghost" className="text-xs h-8" onClick={() => navigate('/calendario')}>Ver Agenda</Button>
            </div>
            
            <div className="divide-y divide-gray-50">
              {events.length > 0 ? events.map((evt) => (
                <div key={evt.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${evt.tipo === 'vacinacao' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm text-gray-900">{evt.titulo}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(evt.data).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{evt.descricao || "Sem detalhes"}</p>
                    
                    {evt.veterinario && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" /> {evt.veterinario}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Nenhum evento recente encontrado.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}