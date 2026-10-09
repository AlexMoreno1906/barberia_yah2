import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Tarjeta from "../../shared/components/Tarjeta";
import { obtenerResumenDashboard, obtenerCitasProximas } from "./dashboardApi";
import { reporteVentasPorMes } from "../reportes/reporteApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [citasProximas, setCitasProximas] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    obtenerResumenDashboard().then(setResumen).catch(() => setResumen({}));
    obtenerCitasProximas().then((datos) => setCitasProximas(datos.citas)).catch(() => {});
  }, []);

  useEffect(() => {
    // la gráfica de ventas se recarga cada vez que se cambia el año
    reporteVentasPorMes({ anio }).then((res) => setVentasPorMes(res.datos)).catch(() => {});
  }, [anio]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen general de la barbería</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Tarjeta titulo="Barberos" valor={resumen?.barberos ?? 0} color="blue" />
        <Tarjeta titulo="Clientes" valor={resumen?.clientes ?? 0} color="green" />
        <Tarjeta titulo="Servicios" valor={resumen?.servicios ?? 0} color="purple" />
        <Tarjeta titulo="Productos" valor={resumen?.productos ?? 0} color="orange" />
        <Tarjeta titulo="Calificación promedio" valor={resumen?.calificacion_promedio ?? 0} color="pink" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tarjeta titulo="Citas hoy" valor={resumen?.citas_hoy ?? 0} color="blue" />
        <Tarjeta titulo="Citas pendientes" valor={resumen?.citas_pendientes ?? 0} color="amber" />
        <Tarjeta titulo="Citas del mes" valor={resumen?.citas_mes ?? 0} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ventas por mes · {anio}</h2>
            <button
              type="button"
              onClick={() => setAnio((a) => a - 1)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2"
            >
              ← {anio - 1}
            </button>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(valor) => [formatearMoneda(valor), "Ventas"]}
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
              />
              <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Próximas citas</h2>
          {citasProximas.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No hay citas próximas</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {citasProximas.map((cita) => (
                <li key={cita.id_cita} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{cita.cliente || "Cliente"}</p>
                    <p className="text-gray-500 text-xs">
                      {cita.fecha} · {cita.hora} · {cita.barbero || "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      cita.estado === "completada"
                        ? "bg-green-100 text-green-700"
                        : cita.estado === "cancelada"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
