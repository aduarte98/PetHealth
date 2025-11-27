import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightChart({ data }) {
  // Se não tiver dados, mostra mensagem simples
  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Sem histórico de peso
      </div>
    );
  }

  // Prepara dados com segurança
  const chartData = data.map(item => ({
    date: new Date(item.data_pesagem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: parseFloat(item.peso)
  }));

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-2">Evolução de Peso</h3>
      
      {/* Importante: O Container pai TEM que ter altura definida */}
      <div style={{ width: '100%', height: '200px' }}> 
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="date" stroke="#aaa" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#aaa" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
            />
            <Line type="monotone" dataKey="peso" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}