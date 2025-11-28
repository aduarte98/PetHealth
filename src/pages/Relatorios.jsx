import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Pet } from "@/entities/Pet";
import { EventoMedico } from "@/entities/EventoMedico";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertMessage } from "@/components/ui/alert-message";
import { FileText, Download, Loader2, PawPrint } from "lucide-react";

export default function Relatorios() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null); // ID do pet sendo gerado
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    const data = await Pet.list();
    setPets(data);
    setLoading(false);
  };

  const generatePDF = async (pet) => {
    setGenerating(pet.id);
    setFeedback(null);
    try {
      // 1. Buscar dados completos
      const eventos = await EventoMedico.listByPetId(pet.id);
      const { data: pesos } = await supabase.from('pesos').select('*').eq('pet_id', pet.id).order('data_pesagem', { ascending: false }).limit(1);
      const pesoAtual = pesos?.[0]?.peso || "N/A";

      // 2. Configurar PDF
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFillColor(37, 99, 235); // Azul
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("Relatório de Saúde - PET HEALTH", 105, 20, { align: "center" });
      
      // Informações do Pet
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(`Pet: ${pet.nome}`, 20, 60);
      
      doc.setFontSize(12);
      doc.text(`Espécie: ${pet.tipo_animal}`, 20, 70);
      doc.text(`Raça: ${pet.raca || 'SRD'}`, 20, 80);
      doc.text(`Idade: ${pet.idade || '?'} anos`, 120, 70);
      doc.text(`Peso Atual: ${pesoAtual} kg`, 120, 80);
      doc.text(`Microchip: ${pet.microchip || 'Não informado'}`, 20, 90);

      if (pet.alergias) {
        doc.setTextColor(220, 38, 38); // Vermelho
        doc.text(`⚠ ALERGIAS: ${pet.alergias}`, 20, 105);
        doc.setTextColor(0, 0, 0);
      }

      // Histórico Médico
      doc.setFontSize(14);
      doc.text("Histórico Recente", 20, 120);
      doc.setLineWidth(0.5);
      doc.line(20, 122, 190, 122);

      let yPos = 135;
      
      if (eventos.length === 0) {
        doc.setFontSize(10);
        doc.text("Nenhum registro encontrado.", 20, yPos);
      } else {
        eventos.forEach((evt) => {
          if (yPos > 270) { doc.addPage(); yPos = 20; } // Nova página se encher
          
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          const dataFormatada = new Date(evt.data).toLocaleDateString('pt-BR');
          doc.text(`${dataFormatada} - ${evt.titulo} (${evt.tipo})`, 20, yPos);
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          yPos += 6;
          doc.text(`Obs: ${evt.descricao || '-'}`, 25, yPos);
          
          if(evt.veterinario) {
            yPos += 5;
            doc.text(`Vet: ${evt.veterinario}`, 25, yPos);
          }
          
          yPos += 12; // Espaço para o próximo item
        });
      }

      // Rodapé
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Gerado em ${new Date().toLocaleDateString()} pelo sistema PET HEALTH`, 105, pageHeight - 10, { align: "center" });

      // Salvar
      doc.save(`Relatorio_${pet.nome}.pdf`);

    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Não foi possível gerar o PDF. Tente novamente." });
    } finally {
      setGenerating(null);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      {feedback && (
        <AlertMessage
          variant={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="text-blue-600" /> Relatórios e Exportação
      </h1>
      <p className="text-gray-500">Gere documentos PDF com o histórico completo para levar ao veterinário ou viagens.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {pets.map(pet => (
          <Card key={pet.id} className="hover:border-blue-300 transition-all cursor-default">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                {pet.foto_url ? (
                  <img src={pet.foto_url} className="w-full h-full rounded-full object-cover" alt={pet.nome} />
                ) : (
                  <PawPrint className="text-blue-300 w-8 h-8" />
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-800">{pet.nome}</h3>
              <p className="text-sm text-gray-500 mb-6">{pet.tipo_animal} • {pet.raca || "SRD"}</p>
              
              <Button 
                onClick={() => generatePDF(pet)} 
                disabled={generating === pet.id}
                className="w-full gap-2"
              >
                {generating === pet.id ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                {generating === pet.id ? "Gerando..." : "Baixar PDF"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}