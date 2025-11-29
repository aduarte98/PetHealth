import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  Pencil,
} from "lucide-react";

export default function EventList({
  events = [],
  onDelete,
  onStatusChange,
  onEdit,
}) {
  // Animação dos itens da lista
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p>Nenhum evento para este dia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        Agenda do Dia
      </h3>

      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className={`
              relative p-4 rounded-xl border border-gray-100 shadow-sm bg-white
              ${event.status === "realizado" ? "opacity-75 bg-gray-50" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              {/* Informações do Evento */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`
                    px-2 py-0.5 text-xs rounded-full font-medium capitalize
                    ${
                      event.tipo === "vacinacao"
                        ? "bg-purple-100 text-purple-700"
                        : event.tipo === "consulta"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  `}
                  >
                    {event.tipo}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {event.hora}
                  </span>
                </div>

                {event.pets?.nome && (
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {event.pets.nome}
                  </p>
                )}

                <h4
                  className={`font-bold text-gray-800 ${
                    event.status === "realizado"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {event.titulo}
                </h4>

                {event.descricao && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {event.descricao}
                  </p>
                )}

                {(event.clinica || event.veterinario) && (
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {event.clinica && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {event.clinica}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 ml-3">
                <button
                  onClick={() => onEdit && onEdit(event)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar evento"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    onStatusChange &&
                    onStatusChange(
                      event.id,
                      event.status === "realizado" ? "agendado" : "realizado"
                    )
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    event.status === "realizado"
                      ? "text-green-600 bg-green-50 hover:bg-green-100"
                      : "text-gray-400 hover:text-green-600 hover:bg-gray-50"
                  }`}
                  title={
                    event.status === "realizado"
                      ? "Marcar como pendente"
                      : "Marcar como realizado"
                  }
                >
                  <CheckCircle size={18} />
                </button>

                <button
                  onClick={() => onDelete && onDelete(event.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir evento"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Faixa lateral colorida baseada no status */}
            <div
              className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full 
              ${event.status === "realizado" ? "bg-green-400" : "bg-blue-500"}
            `}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
