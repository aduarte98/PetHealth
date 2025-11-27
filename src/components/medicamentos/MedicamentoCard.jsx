import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, CheckCircle, Clock, Pill, CalendarDays, AlertCircle, Loader2 } from "lucide-react";
import { format, differenceInDays, addDays, isBefore, isAfter, startOfDay } from 'date-fns';

export default function MedicamentoCard({ medicamento, onEdit, onDelete, onUpdateStatus }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hoje = startOfDay(new Date());
  const dataInicio = startOfDay(new Date(medicamento.data_inicio));
  const dataFim = addDays(dataInicio, medicamento.duracao_dias);
  const diasPassados = differenceInDays(hoje, dataInicio);
  const progresso = Math.max(0, Math.min(100, ((diasPassados + 1) / medicamento.duracao_dias) * 100));

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(medicamento.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await onUpdateStatus(medicamento.id, 'concluido');
    setIsCompleting(false);
  };

  let statusTratamento;
  if (medicamento.status === 'concluido') {
    statusTratamento = { text: 'Concluído', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4 text-green-600" /> };
  } else if (isBefore(hoje, dataInicio)) {
    statusTratamento = { text: 'A iniciar', color: 'bg-gray-100 text-gray-800', icon: <CalendarDays className="w-4 h-4 text-gray-600" /> };
  } else if (isAfter(hoje, dataFim)) {
    statusTratamento = { text: 'Atrasado', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4 text-red-600" /> };
  } else {
    statusTratamento = { text: 'Em andamento', color: 'bg-blue-100 text-blue-800', icon: <Pill className="w-4 h-4 text-blue-600" /> };
  }

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-gray-800">{medicamento.nome_medicamento}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(medicamento)}><Edit className="w-4 h-4 text-gray-500" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {statusTratamento.icon}
            <Badge variant="outline" className={`${statusTratamento.color} border-0`}>{statusTratamento.text}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Pill className="w-4 h-4" />
            <span>Dosagem: <span className="font-medium text-gray-800">{medicamento.dosagem}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Horários: <span className="font-medium text-gray-800">{medicamento.horarios}</span></span>
          </div>
          {medicamento.instrucoes && (
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">{medicamento.instrucoes}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="w-full">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Dia {Math.max(0, diasPassados + 1)} de {medicamento.duracao_dias}</span>
              <span>Fim em: {format(dataFim, 'dd/MM/yy')}</span>
            </div>
            <Progress value={progresso} className="w-full h-2" />
          </div>
          {medicamento.status === 'ativo' && (
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Marcar como Concluído
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h3 className="font-bold text-lg">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">Deseja realmente excluir o tratamento com {medicamento.nome_medicamento}? Esta ação é irreversível.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}