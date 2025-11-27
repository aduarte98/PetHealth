import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Cake, Weight, Palette, Heart, Hash, CalendarDays } from "lucide-react"; // Importado CalendarDays
import { format } from "date-fns";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
      {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function DetalhesInfo({ pet }) {
  const calcularIdadeExibicao = () => {
    // Prioriza a idade numérica se estiver presente
    if (pet.idade) {
      return `${pet.idade} anos`;
    }
    // Caso contrário, calcula a partir da data de nascimento
    if (pet.data_nascimento) {
      const nascimento = new Date(pet.data_nascimento);
      const hoje = new Date();
      let anos = hoje.getFullYear() - nascimento.getFullYear();
      let meses = hoje.getMonth() - nascimento.getMonth();
      if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
        anos--;
        meses += 12;
      }
      return `${anos} anos e ${meses} meses`;
    }
    return 'Não informado';
  };

  return (
    <Card className="mt-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoItem 
            icon={<CalendarDays />} // Ícone mais apropriado para idade
            label="Idade" 
            value={calcularIdadeExibicao()}
          />
          {pet.data_nascimento && (
             <InfoItem 
              icon={<Cake />} 
              label="Nascimento" 
              value={format(new Date(pet.data_nascimento), "dd/MM/yyyy")}
            />
          )}
          {pet.peso && (
            <InfoItem 
              icon={<Weight />} 
              label="Peso" 
              value={`${pet.peso} kg`}
            />
          )}
          {pet.cor && (
            <InfoItem 
              icon={<Palette />} 
              label="Cor" 
              value={pet.cor}
            />
          )}
          <InfoItem 
            icon={<Heart />} 
            label="Castrado" 
            value={pet.castrado ? 'Sim' : 'Não'}
          />
          {pet.microchip && (
            <InfoItem 
              icon={<Hash />} 
              label="Microchip" 
              value={pet.microchip}
            />
          )}
        </div>
        
        {pet.observacoes && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Observações Especiais</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{pet.observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}