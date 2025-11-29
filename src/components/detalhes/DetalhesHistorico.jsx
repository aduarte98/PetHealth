import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format, isPast, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const tipoColors = {
  consulta: "bg-blue-100 text-blue-800 border-blue-300",
  vacinacao: "bg-green-100 text-green-800 border-green-300",
  exame: "bg-purple-100 text-purple-800 border-purple-300",
  cirurgia: "bg-red-100 text-red-800 border-red-300",
  medicamento: "bg-yellow-100 text-yellow-800 border-yellow-300",
  outro: "bg-gray-100 text-gray-800 border-gray-300",
};

const statusIcons = {
  agendado: <AlertCircle className="w-4 h-4 text-blue-500" />,
  realizado: <CheckCircle className="w-4 h-4 text-green-500" />,
  cancelado: <XCircle className="w-4 h-4 text-red-500" />,
};

const statusColors = {
  agendado: "bg-blue-50 text-blue-700 border-blue-200",
  realizado: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-red-50 text-red-700 border-red-200",
};

export default function DetalhesHistorico({ eventos }) {
  const eventosOrdenados = [...eventos].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );

  if (eventos.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhum evento registrado
          </h3>
          <p className="text-gray-500">
            O histórico de eventos aparecerá aqui conforme você adicionar
            consultas, vacinas e outros cuidados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {eventosOrdenados.map((evento, index) => {
        const dataEvento = startOfDay(new Date(evento.data));
        const jaAconteceu = isPast(dataEvento);
        const cardOpacity = jaAconteceu ? "opacity-60" : "";

        return (
          <motion.div
            key={evento.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow ${cardOpacity}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-800 mb-2">
                      {evento.titulo}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${tipoColors[evento.tipo]} border`}>
                        {evento.tipo}
                      </Badge>
                      <Badge
                        className={`${
                          statusColors[evento.status]
                        } border flex items-center gap-1`}
                      >
                        {statusIcons[evento.status]}
                        {evento.status}
                      </Badge>
                      {jaAconteceu && evento.status === "agendado" && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-300 border">
                          Passou da data
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    {format(new Date(evento.data), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                  {evento.hora && (
                    <>
                      <Clock className="w-4 h-4 text-blue-500 ml-2" />
                      <span>{evento.hora}</span>
                    </>
                  )}
                </div>

                {evento.veterinario && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-green-500" />
                    <span>Dr(a). {evento.veterinario}</span>
                  </div>
                )}

                {evento.clinica && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{evento.clinica}</span>
                  </div>
                )}

                {evento.preco && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">
                      R$ {evento.preco.toFixed(2)}
                    </span>
                  </div>
                )}

                {evento.descricao && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p>{evento.descricao}</p>
                    </div>
                  </div>
                )}

                {evento.observacoes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 italic">
                      {evento.observacoes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
