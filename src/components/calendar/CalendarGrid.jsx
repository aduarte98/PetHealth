import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarGrid({ events = [], selectedDate, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (increment) => {
    setCurrentDate(prev => increment > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  // Gera os dias do calendário
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div>
      {/* Cabeçalho (Mês e Botões) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid dos Dias da Semana */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid dos Dias */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, dayIdx) => {
          // Verifica eventos neste dia (comparando string YYYY-MM-DD)
          const dayString = format(day, 'yyyy-MM-dd');
          const dayEvents = events.filter(e => e.data === dayString);
          const hasEvents = dayEvents.length > 0;
          
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div 
              key={day.toString()}
              onClick={() => onSelectDate(day)} // AQUI ESTÁ O CLIQUE
              className={`
                min-h-[80px] p-2 rounded-xl border transition-all cursor-pointer relative group
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 z-10' 
                  : 'border-gray-100 hover:border-blue-200 bg-white'
                }
                ${!isCurrentMonth && 'opacity-40 bg-gray-50'}
              `}
            >
              <span className={`
                text-sm font-medium block w-7 h-7 flex items-center justify-center rounded-full
                ${isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
              </span>

              {/* Bolinhas dos Eventos */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {dayEvents.map((evt, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      w-2 h-2 rounded-full
                      ${evt.tipo === 'vacinacao' ? 'bg-purple-400' : 
                        evt.tipo === 'consulta' ? 'bg-blue-400' : 
                        'bg-orange-400'}
                    `}
                    title={evt.titulo}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-gray-400">+</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}