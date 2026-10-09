import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { useDetalle } from "../../shared/hooks/useDetalle";
import Paginacion from "../../shared/components/Paginacion";
import ModalDetalle from "../../shared/components/ModalDetalle";
import { listarCitas, eliminarCita, obtenerCita } from "./citaApi";
import { listarBarberos } from "../barberos/barberoApi";

// colores de cada estado para las etiquetas de la tabla y del modal
const estilosEstado = {
  pendiente: "bg-yellow-100 text-yellow-700",
  confirmada: "bg-green-100 text-green-700",
  completada: "bg-blue-100 text-blue-700",
  cancelada: "bg-red-100 text-red-700",
};

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function Citas() {
  const { items, pagina, totalPaginas, total, filtros, cargando, error, aplicarFiltros, irAPagina, eliminar } =
    usePaginado(listarCitas, {
      eliminador: (cita) => eliminarCita(cita.id_cita),
      confirmar: (cita) => `¿Eliminar la cita #${cita.id_cita}? Esta acción no se puede deshacer.`,
    });
  const { detalle, cargando: detalleCargando, abrir: verDetalle, cerrar: cerrarDetalle } =
    useDetalle(obtenerCita);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    // los barberos se cargan solo para llenar el filtro de la tabla
    listarBarberos({ tamano: 1000 })
      .then((res) => setBarberos(res.items))
      .catch(() => {});
  }, []);

  function cambiarFiltro(campo, valor) {
    aplicarFiltros({ ...filtros, [campo]: valor });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Citas</h1>
          <p className="text-gray-500 text-sm">Agenda de citas con clientes</p>
        </div>
        <Link
          to="/citas/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva cita
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filtros.estado || ""}
          onChange={(evento) => cambiarFiltro("estado", evento.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <select
          value={filtros.id_barbero || ""}
          onChange={(evento) => cambiarFiltro("id_barbero", evento.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todos los barberos</option>
          {barberos.map((barbero) => (
            <option key={barbero.id_barbero} value={barbero.id_barbero}>
              {barbero.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={7}>
                  Cargando...
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={7}>
                  No hay citas registradas.
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((cita) => {
                const estilo =
                  estilosEstado[cita.estado?.toLowerCase()] || "bg-gray-100 text-gray-600";
                return (
                  <tr key={cita.id_cita}>
                    <td className="px-4 py-3 text-gray-600">{cita.id_cita}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{cita.fecha}</td>
                    <td className="px-4 py-3 text-gray-600">{cita.hora}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estilo}`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cita.nombre_cliente || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{cita.nombre_barbero || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          title="Ver detalle"
                          className="text-gray-600 hover:text-blue-700"
                          onClick={() => verDetalle(cita.id_cita)}
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/citas/${cita.id_cita}/editar`}
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </Link>
                        <button
                          type="button"
                          title="Eliminar"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => eliminar(cita)}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <Paginacion pagina={pagina} totalPaginas={totalPaginas} total={total} irAPagina={irAPagina} />
      </div>

      {detalle && (
        <ModalDetalle
          titulo={`Cita #${detalle.id_cita || ""}`}
          abierto
          cargando={detalleCargando}
          error={detalle.error}
          alCerrar={cerrarDetalle}
        >
          {!detalle.error && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium text-gray-800">{detalle.fecha}</p>
                </div>
                <div>
                  <p className="text-gray-500">Hora</p>
                  <p className="font-medium text-gray-800">{detalle.hora}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-800">{detalle.nombre_cliente || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Barbero</p>
                  <p className="font-medium text-gray-800">{detalle.nombre_barbero || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <span
                    className={`inline-block mt-0.5 px-2 py-1 rounded-full text-xs font-semibold ${
                      estilosEstado[detalle.estado?.toLowerCase()] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {detalle.estado}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Servicios</h3>
                {detalle.servicios?.length ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 text-xs uppercase">
                        <th className="pb-2">Servicio</th>
                        <th className="pb-2 text-right">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {detalle.servicios.map((servicio) => (
                        <tr key={servicio.id_servicio}>
                          <td className="py-2">{servicio.nombre}</td>
                          <td className="py-2 text-right font-medium">
                            {formatearMoneda(servicio.precio)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">Sin servicios asociados.</p>
                )}
              </div>
            </div>
          )}
        </ModalDetalle>
      )}
    </div>
  );
}

export default Citas;
