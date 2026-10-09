import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tarjeta from "../../shared/components/Tarjeta";
import { useAuth } from "../../contexto/AuthContext";
import { obtenerResumenDashboard, obtenerCitasProximas } from "../dashboard/dashboardApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function Inicio() {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [citasProximas, setCitasProximas] = useState([]);

  useEffect(() => {
    obtenerResumenDashboard().then(setResumen).catch(() => setResumen({}));
    obtenerCitasProximas({ limite: 5 }).then((datos) => setCitasProximas(datos.citas)).catch(() => {});
  }, []);

  // atajos del panel; el de nueva venta solo lo ve el administrador
  const accesosRapidos = [
    { a: "/citas/nueva", t: "Nueva cita" },
    { a: "/clientes/nuevo", t: "Nuevo cliente" },
    { a: "/reportes/estadisticos", t: "Estadísticas" },
  ];
  if (usuario?.rol === "Administrador") {
    accesosRapidos.unshift({ a: "/ventas/nueva", t: "Nueva venta" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Panel Barbería</h1>
        <p className="text-gray-500">
          Barbería Yah - Principal | Bienvenido, estamos listos para atenderte
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Tarjeta titulo="Barberos" valor={resumen?.barberos ?? 0} color="blue" />
        <Tarjeta titulo="Clientes" valor={resumen?.clientes ?? 0} color="green" />
        <Tarjeta titulo="Servicios" valor={resumen?.servicios ?? 0} color="purple" />
        <Tarjeta titulo="Productos" valor={resumen?.productos ?? 0} color="orange" />
        <Tarjeta titulo="Citas " valor={resumen?.citas_hoy ?? 0} color="cyan" />
        <Tarjeta titulo="Ventas del mes" valor={formatearMoneda(resumen?.ventas_mes ?? 0)} color="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Próximas citas</h2>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver dashboard
            </Link>
          </div>
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
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    {cita.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            {accesosRapidos.map((enlace) => (
              <Link
                key={enlace.t}
                to={enlace.a}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-4 py-3 text-sm font-semibold text-amber-800 transition-colors"
              >
                {enlace.t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
