import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Pill,
  CalendarDays,
  AlertCircle,
  Loader2,
  CheckSquare,
  RotateCcw,
  RefreshCcw,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import {
  format,
  differenceInDays,
  addDays,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";

function IconLabelButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  loading,
  variant = "primary",
  fullWidth = false,
}) {
  const baseStyle =
    "flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[115px]";

  const palette = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    neutral: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
    muted: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${fullWidth ? "w-full" : ""} ${baseStyle} ${
        palette[variant] ?? palette.primary
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export default function MedicamentoCard({
  medicamento,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdateProgress,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hoje = startOfDay(new Date());
  const dataInicio = startOfDay(new Date(medicamento.data_inicio));
  const totalDias = Number(medicamento.duracao_dias) || 0;
  const dataFim = addDays(dataInicio, totalDias || 0);

  const initialDias = Math.max(
    0,
    Math.min(totalDias, medicamento.dias_concluidos ?? 0)
  );

  const [currentDias, setCurrentDias] = useState(initialDias);
  const [currentStatus, setCurrentStatus] = useState(
    medicamento.status ?? "ativo"
  );
  const prevDiasRef = useRef(initialDias);

  useEffect(() => {
    setCurrentDias(initialDias);
    prevDiasRef.current = initialDias;
  }, [initialDias]);

  useEffect(() => {
    setCurrentStatus(medicamento.status ?? "ativo");
  }, [medicamento.status]);

  const diasRestantes = Math.max(0, totalDias - currentDias);
  const progresso =
    totalDias > 0 ? Math.round((currentDias / totalDias) * 100) : 0;
  const podeRegistrarHoje =
    currentStatus !== "concluido" && currentDias < totalDias;
  const podeDesfazer = currentDias > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(medicamento.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleRegisterDay = async () => {
    if (!podeRegistrarHoje || !onUpdateProgress) return;
    setIsRegistering(true);
    const novoTotal = Math.min(totalDias, currentDias + 1);
    const deveConcluir =
      novoTotal >= totalDias && currentStatus !== "concluido";
    const updated = await onUpdateProgress(
      medicamento.id,
      novoTotal,
      deveConcluir ? "concluido" : undefined
    );
    if (updated) {
      setCurrentDias(novoTotal);
      if (deveConcluir) setCurrentStatus("concluido");
    }
    setIsRegistering(false);
  };

  const handleUndoDay = async () => {
    if (!podeDesfazer || currentStatus === "concluido" || !onUpdateProgress)
      return;
    setIsUndoing(true);
    const novoTotal = Math.max(0, currentDias - 1);
    const precisaReabrir =
      currentStatus === "concluido" && novoTotal < totalDias;
    const updated = await onUpdateProgress(
      medicamento.id,
      novoTotal,
      precisaReabrir ? "ativo" : undefined
    );
    if (updated) {
      setCurrentDias(novoTotal);
      if (precisaReabrir) setCurrentStatus("ativo");
    }
    setIsUndoing(false);
  };

  const handleToggleStatus = async () => {
    if (!onUpdateStatus) return;
    setIsTogglingStatus(true);

    let nextStatus;
    let novoTotal = currentDias;

    if (currentStatus === "concluido") {
      nextStatus = "ativo";
      const previous = prevDiasRef.current ?? currentDias;
      novoTotal = Math.max(0, previous - 1);
    } else if (currentStatus === "pausado") {
      nextStatus = "ativo";
    } else {
      nextStatus = "concluido";
      novoTotal = totalDias || currentDias;
    }

    const updated = await onUpdateStatus(medicamento.id, nextStatus, {
      dias_concluidos: novoTotal,
    });

    if (updated) {
      setCurrentStatus(nextStatus);
      setCurrentDias(novoTotal);
      if (nextStatus === "concluido") {
        prevDiasRef.current = currentDias;
      }
    }
    setIsTogglingStatus(false);
  };

  const handleTogglePause = async () => {
    if (!onUpdateStatus) return;
    const novoStatus = currentStatus === "pausado" ? "ativo" : "pausado";
    const updated = await onUpdateStatus(medicamento.id, novoStatus);
    if (updated) {
      setCurrentStatus(novoStatus);
    }
  };

  let statusTratamento;
  if (currentStatus === "concluido" || currentDias >= totalDias) {
    statusTratamento = {
      text: "Concluído",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    };
  } else if (isBefore(hoje, dataInicio)) {
    statusTratamento = {
      text: "A iniciar",
      color: "bg-gray-100 text-gray-800",
      icon: <CalendarDays className="w-4 h-4 text-gray-600" />,
    };
  } else if (isAfter(hoje, dataFim)) {
    statusTratamento = {
      text: "Atrasado",
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="w-4 h-4 text-red-600" />,
    };
  } else if (currentStatus === "pausado") {
    statusTratamento = {
      text: "Pausado",
      color: "bg-amber-100 text-amber-800",
      icon: <PauseCircle className="w-4 h-4 text-amber-500" />,
    };
  } else {
    statusTratamento = {
      text: "Em andamento",
      color: "bg-blue-100 text-blue-800",
      icon: <Pill className="w-4 h-4 text-blue-600" />,
    };
  }

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-gray-800">
              {medicamento.nome_medicamento}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(medicamento)}
                className="text-blue-500 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            {statusTratamento.icon}
            <Badge
              variant="outline"
              className={`${statusTratamento.color} border-0`}
            >
              {statusTratamento.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Pill className="w-4 h-4" />
            <span>
              Dosagem:{" "}
              <span className="font-medium text-gray-800">
                {medicamento.dosagem}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              Horários:{" "}
              <span className="font-medium text-gray-800">
                {medicamento.horarios}
              </span>
            </span>
          </div>
          {medicamento.instrucoes && (
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
              {medicamento.instrucoes}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3">
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              {totalDias > 0 ? (
                <span>
                  Dia {Math.min(currentDias + 1, totalDias)} de {totalDias}
                </span>
              ) : (
                <span>Duração não informada</span>
              )}
              <span>Fim previsto: {format(dataFim, "dd/MM/yy")}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-green-400 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>{progresso}% concluído</span>
              {totalDias > 0 && (
                <span>
                  {diasRestantes === 0
                    ? "Tratamento finalizado"
                    : `${diasRestantes} dia${
                        diasRestantes === 1 ? "" : "s"
                      } restante${diasRestantes === 1 ? "" : "s"}`}
                </span>
              )}
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <IconLabelButton
                label="Registrar dose"
                icon={CheckSquare}
                variant="primary"
                onClick={handleRegisterDay}
                disabled={!podeRegistrarHoje || isRegistering}
                loading={isRegistering}
              />

              <IconLabelButton
                label="Desfazer dose"
                icon={RotateCcw}
                variant="muted"
                onClick={handleUndoDay}
                disabled={
                  !podeDesfazer || currentStatus === "concluido" || isUndoing
                }
                loading={isUndoing}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <IconLabelButton
                label={currentStatus === "pausado" ? "Retomar" : "Pausar"}
                icon={currentStatus === "pausado" ? PlayCircle : PauseCircle}
                variant="neutral"
                onClick={handleTogglePause}
                disabled={currentStatus === "concluido" || isTogglingStatus}
                fullWidth
              />

              <IconLabelButton
                label={
                  currentStatus === "concluido"
                    ? "Reabrir tratamento"
                    : "Concluir tratamento"
                }
                icon={RefreshCcw}
                variant={currentStatus === "concluido" ? "neutral" : "success"}
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                loading={isTogglingStatus}
                fullWidth
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h3 className="font-bold text-lg">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Deseja realmente excluir o tratamento com{" "}
              {medicamento.nome_medicamento}? Esta ação é irreversível.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Excluir"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
