import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import Paginacion from "../../shared/components/Paginacion";
import { listarCalificaciones, eliminarCalificacion } from "./calificacionApi";

// convierte la puntuación numérica en un string de estrellas llenas y vacías
function estrellas(puntuacion) {
  return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
}

function Calificaciones() {
  const { items, pagina, totalPaginas, total, filtros, cargando, error, aplicarFiltros, irAPagina, eliminar } =
    usePaginado(listarCalificaciones, {
      eliminador: (calificacion) => eliminarCalificacion(calificacion.id_calificacion),
      confirmar: (calificacion) => `¿Eliminar la calificación #${calificacion.id_calificacion}?`,
    });

  function cambiarPuntuacion(evento) {
    aplicarFiltros({ ...filtros, puntuacion: evento.target.value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calificaciones</h1>
          <p className="text-gray-500 text-sm">Opiniones de los clientes sobre el servicio</p>
        </div>
        <Link
          to="/calificaciones/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva calificación
        </Link>
      </div>

      <select
        value={filtros.puntuacion || ""}
        onChange={cambiarPuntuacion}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="">Todas las puntuaciones</option>
        <option value="1">1 estrella</option>
        <option value="2">2 estrellas</option>
        <option value="3">3 estrellas</option>
        <option value="4">4 estrellas</option>
        <option value="5">5 estrellas</option>
      </select>

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
              <th className="px-4 py-3">Puntuación</th>
              <th className="px-4 py-3">Comentario</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Cita</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  Cargando...
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  No hay calificaciones registradas.
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((calificacion) => (
                <tr key={calificacion.id_calificacion}>
                  <td className="px-4 py-3 text-gray-600">{calificacion.id_calificacion}</td>
                  <td className="px-4 py-3 text-amber-500">{estrellas(calificacion.puntuacion)}</td>
                  <td className="px-4 py-3 text-gray-600">{calificacion.comentario || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{calificacion.nombre_cliente || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{calificacion.id_cita}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/calificaciones/${calificacion.id_calificacion}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(calificacion)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Paginacion pagina={pagina} totalPaginas={totalPaginas} total={total} irAPagina={irAPagina} />
      </div>
    </div>
  );
}

export default Calificaciones;
