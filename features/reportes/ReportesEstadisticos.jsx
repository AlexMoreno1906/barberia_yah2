import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  reporteVentasPorMes,
  reporteCitasPorBarbero,
  reporteCalificacionesPorPuntuacion,
  reporteServiciosMasSolicitados,
  reporteProductosMasVendidos,
} from "./reporteApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

const COLORES = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];

// cada gráfica va dentro del mismo contenedor para mantener el estilo parejo
function ContenedorGrafica({ titulo, children, extra }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{titulo}</h2>
        {extra}
      </div>
      <ResponsiveContainer width="100%" height={280}>{children}</ResponsiveContainer>
    </div>
  );
}

function ReportesEstadisticos() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [ventasPorMes, setVentasPorMes] = useState({ anio, datos: [] });
  const [citasPorBarbero, setCitasPorBarbero] = useState([]);
  const [calificaciones, setCalificaciones] = useState({ items: [], promedio: 0, total: 0 });
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    reporteVentasPorMes({ anio }).then((r) => setVentasPorMes(r)).catch(() => {});
  }, [anio]);

  useEffect(() => {
    reporteCitasPorBarbero({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
      .then((r) => setCitasPorBarbero(r.items))
      .catch(() => {});
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    reporteCalificacionesPorPuntuacion().then(setCalificaciones).catch(() => {});
    reporteServiciosMasSolicitados().then((r) => setServicios(r.items)).catch(() => {});
    reporteProductosMasVendidos().then((r) => setProductos(r.items)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reportes estadísticos</h1>
        <p className="text-gray-500 text-sm">Indicadores y gráficas con datos reales</p>
      </div>

      <ContenedorGrafica
        titulo="Ventas por mes"
        extra={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAnio((a) => a - 1)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2"
            >
              ← {anio - 1}
            </button>
            <span className="text-sm font-semibold text-gray-700">{anio}</span>
            <button
              type="button"
              onClick={() => setAnio((a) => a + 1)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2"
            >
              {anio + 1} →
            </button>
          </div>
        }
      >
        <BarChart data={ventasPorMes.datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(valor) => [formatearMoneda(valor), "Total"]} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
          <Legend />
          <Bar dataKey="total" name="Ventas ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ventas" name="Número de ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ContenedorGrafica>

      <ContenedorGrafica
        titulo="Citas por barbero"
        extra={
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1"
            />
          </div>
        }
      >
        <BarChart data={citasPorBarbero}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="barbero" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
          <Bar dataKey="cantidad" name="Citas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ContenedorGrafica>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ContenedorGrafica titulo={`Calificaciones por puntuación (promedio: ${calificaciones.promedio})`}>
          <PieChart>
            <Pie
              data={calificaciones.items}
              dataKey="cantidad"
              nameKey="puntuacion"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entrada) => `${entrada.puntuacion}★`}
            >
              {calificaciones.items.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
            <Legend />
          </PieChart>
        </ContenedorGrafica>

        <ContenedorGrafica titulo="Servicios más solicitados">
          <BarChart data={servicios} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="servicio" width={110} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
            <Bar dataKey="solicitudes" name="Solicitudes" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ContenedorGrafica>
      </div>

      <ContenedorGrafica titulo="Productos más vendidos">
        <BarChart data={productos} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="producto" width={110} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
          <Bar dataKey="unidades" name="Unidades vendidas" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ContenedorGrafica>
    </div>
  );
}

export default ReportesEstadisticos;
