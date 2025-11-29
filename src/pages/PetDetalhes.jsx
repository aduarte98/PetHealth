import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pet } from "@/entities/Pet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Activity,
  MapPin,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { differenceInYears } from "date-fns";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const STATUS_LABELS = {
  agendado: "Agendado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

const TYPE_LABELS = {
  consulta: "Consulta",
  vacinacao: "Vacinação",
  exame: "Exame",
  cirurgia: "Cirurgia",
  medicamento: "Medicamento",
  outro: "Outro",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const EMPTY_ANALYTICS = {
  totalEvents: 0,
  totalSpent: 0,
  statusCounts: [],
  typeCounts: [],
  monthly: [],
  yearly: [],
};

const normalizeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildEventAnalytics = (allEvents = []) => {
  if (!Array.isArray(allEvents) || allEvents.length === 0) {
    return { ...EMPTY_ANALYTICS };
  }

  const statusCounts = {};
  const typeCounts = {};
  const monthly = {};
  const yearly = {};
  let totalSpent = 0;

  allEvents.forEach((evt) => {
    const price = normalizeNumber(evt.preco);
    totalSpent += price;

    const statusKey = evt.status?.toLowerCase() ?? "sem_status";
    statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

    const typeKey = evt.tipo?.toLowerCase() ?? "outro";
    typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;

    if (evt.data) {
      const date = new Date(evt.data);
      if (!Number.isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const yearKey = String(date.getFullYear());

        if (!monthly[monthKey]) {
          monthly[monthKey] = {
            key: monthKey,
            label: date.toLocaleDateString("pt-BR", {
              month: "short",
              year: "numeric",
            }),
            total: 0,
            spent: 0,
          };
        }
        monthly[monthKey].total += 1;
        monthly[monthKey].spent += price;

        if (!yearly[yearKey]) {
          yearly[yearKey] = {
            key: yearKey,
            label: yearKey,
            total: 0,
            spent: 0,
          };
        }
        yearly[yearKey].total += 1;
        yearly[yearKey].spent += price;
      }
    }
  });

  const mapCounts = (map) =>
    Object.entries(map).map(([label, value]) => ({ label, value }));

  const mapTimeline = (map) =>
    Object.values(map).sort((a, b) => a.key.localeCompare(b.key));

  return {
    totalEvents: allEvents.length,
    totalSpent,
    statusCounts: mapCounts(statusCounts),
    typeCounts: mapCounts(typeCounts),
    monthly: mapTimeline(monthly),
    yearly: mapTimeline(yearly),
  };
};

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const formatStatusLabel = (label) => {
  if (!label || label === "sem_status") return "Sem status";
  return STATUS_LABELS[label] ?? label;
};

const formatTypeLabel = (label) => {
  if (!label) return TYPE_LABELS.outro;
  return TYPE_LABELS[label] ?? label;
};

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#9333ea",
  "#f43f5e",
  "#0ea5e9",
];

const SummaryMetricCard = ({ icon: Icon, label, value, helper }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      </div>
    </div>
  </div>
);

const HistoryCard = ({ events, onNavigateCalendar }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <h3 className="font-bold text-gray-700 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-500" /> Histórico Recente
      </h3>
      <Button
        variant="ghost"
        className="text-xs h-8"
        onClick={onNavigateCalendar}
      >
        Ver Agenda
      </Button>
    </div>

    <div className="divide-y divide-gray-50">
      {events.length > 0 ? (
        events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
          >
            <div
              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                evt.tipo === "vacinacao" ? "bg-purple-500" : "bg-blue-500"
              }`}
            />

            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-sm text-gray-900">
                  {evt.titulo}
                </h4>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(evt.data).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {evt.descricao || "Sem detalhes"}
              </p>

              {evt.veterinario && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" /> {evt.veterinario}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-gray-400 text-sm">
          Nenhum evento recente encontrado.
        </div>
      )}
    </div>
  </div>
);

const DistributionList = ({ title, data, formatLabelFn }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-full">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-gray-700">{title}</h4>
      <span className="text-xs text-gray-400">Qtd.</span>
    </div>
    {data.length ? (
      <ul className="space-y-2">
        {data.map(({ label, value }) => (
          <li
            key={label}
            className="flex items-center justify-between text-sm text-gray-600"
          >
            <span>{formatLabelFn ? formatLabelFn(label) : label}</span>
            <span className="font-semibold text-gray-900">
              {value.toLocaleString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-400">Sem dados suficientes.</p>
    )}
  </div>
);

const TimelineTable = ({ title, rows }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-full">
    <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
    {rows.length ? (
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between text-sm text-gray-600"
          >
            <div>
              <p className="font-medium text-gray-900">{row.label}</p>
              <p className="text-xs text-gray-400">
                {row.total.toLocaleString("pt-BR")} eventos •{" "}
                {formatCurrency(row.spent)}
              </p>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {row.total.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400">Sem registros.</p>
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="h-full flex items-center justify-center text-sm text-gray-400 min-h-[150px]">
    {message}
  </div>
);

const PieDistribution = ({ title, data, formatLabelFn }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-full">
    <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
    {data.length ? (
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:w-1/2 h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ReTooltip
                formatter={(value, name, props) => [
                  `${value.toLocaleString("pt-BR")} eventos`,
                  formatLabelFn
                    ? formatLabelFn(props.payload.label)
                    : props.payload.label,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map(({ label, value }, index) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span>{formatLabelFn ? formatLabelFn(label) : label}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {value.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <EmptyState message="Sem dados suficientes." />
    )}
  </div>
);

const TimelineChart = ({ title, rows }) => (
  <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-full">
    <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
    {rows.length ? (
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={rows}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              fontSize={11}
            />
            <ReTooltip
              formatter={(value, name, props) => [
                `${value.toLocaleString("pt-BR")} eventos`,
                props.payload.label,
              ]}
            />
            <Legend
              formatter={(value) => (value === "total" ? "Eventos" : value)}
            />
            <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyState message="Sem registros." />
    )}
  </div>
);

export default function PetDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventAnalytics, setEventAnalytics] = useState(EMPTY_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // 1. Dados do Pet
        const petData = await Pet.getById(id);
        setPet(petData);

        // 2. Eventos do pet (usados para analytics e histórico)
        const { data: eventsData } = await supabase
          .from("eventos_medicos")
          .select("*")
          .eq("pet_id", id)
          .order("data", { ascending: false });

        const allEvents = eventsData || [];
        setEvents(allEvents.slice(0, 5));
        setEventAnalytics(buildEventAnalytics(allEvents));
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

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
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
                <img
                  src={pet.foto_url}
                  alt={pet.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-300">
                  Sem Foto
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{pet.nome}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {pet.tipo_animal} • {pet.raca || "SRD"}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Idade
                </p>
                <p className="font-semibold text-gray-700">{getAgeLabel()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Peso Atual
                </p>
                <p className="font-semibold text-gray-700">
                  {pet.peso || "?"} kg
                </p>
              </div>
            </div>
          </div>

          {/* Card de Alergias */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h3 className="text-xs font-bold text-red-800 uppercase mb-2">
              Alergias e Restrições
            </h3>
            <p className="text-sm text-red-700">
              {pet.alergias || "Nenhuma alergia registrada."}
            </p>
          </div>
        </div>

        {/* COLUNA 2 & 3: INSIGHTS E HISTÓRICO */}
        <div className="md:col-span-2 space-y-6">
          {/* Painel de insights */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-700">
                Insights do calendário
              </h3>
              <p className="text-sm text-gray-500">
                Visualize distribuições por status, tipo, período e o total
                investido em cuidados.
              </p>
            </div>
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryMetricCard
                  icon={TrendingUp}
                  label="Total de eventos"
                  value={eventAnalytics.totalEvents.toLocaleString("pt-BR")}
                  helper="Inclui consultas, vacinas, exames e demais registros."
                />
                <SummaryMetricCard
                  icon={Wallet}
                  label="Gasto total"
                  value={formatCurrency(eventAnalytics.totalSpent)}
                  helper="Somatório dos valores cadastrados nos eventos."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PieDistribution
                  title="Eventos por status"
                  data={eventAnalytics.statusCounts}
                  formatLabelFn={formatStatusLabel}
                />
                <PieDistribution
                  title="Eventos por tipo"
                  data={eventAnalytics.typeCounts}
                  formatLabelFn={formatTypeLabel}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TimelineChart
                  title="Eventos por mês"
                  rows={eventAnalytics.monthly}
                />
                <TimelineTable
                  title="Eventos por ano"
                  rows={eventAnalytics.yearly}
                />
              </div>
            </div>
          </div>
          {/* Lista de Eventos Linkados */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Histórico Recente
              </h3>
              <Button
                variant="ghost"
                className="text-xs h-8"
                onClick={() => navigate("/calendario")}
              >
                Ver Agenda
              </Button>
            </div>

            <div className="divide-y divide-gray-50">
              {events.length > 0 ? (
                events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
                  >
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        evt.tipo === "vacinacao"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm text-gray-900">
                          {evt.titulo}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(evt.data).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {evt.descricao || "Sem detalhes"}
                      </p>

                      {evt.veterinario && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" /> {evt.veterinario}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
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
