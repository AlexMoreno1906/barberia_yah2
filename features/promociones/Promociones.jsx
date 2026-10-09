import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { listarPromociones, eliminarPromocion } from "./promocionApi";
import Paginacion from "../../shared/components/Paginacion";

function Promociones() {
  const ubicacion = useLocation();
  const [exito, setExito] = useState(ubicacion.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const {
    items,
    pagina,
    totalPaginas,
    total,
    filtros,
    cargando,
    error,
    aplicarFiltros,
    irAPagina,
    eliminar,
  } = usePaginado(listarPromociones, {
      eliminador: (promocion) => eliminarPromocion(promocion.id_promocion),
      confirmar: (promocion) => `¿Eliminar la promoción "${promocion.titulo}"? Esta acción no se puede deshacer.`,
    });

  function cambiarActivas(evento) {
    aplicarFiltros({ ...filtros, activas: evento.target.value === "true" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Promociones</h1>
          <p className="text-gray-500 text-sm">Descuentos vigentes sobre servicios</p>
        </div>
        <Link
          to="/promociones/nueva"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva promoción
        </Link>
      </div>

      <select
        value={filtros.activas ? "true" : "false"}
        onChange={cambiarActivas}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <option value="false">Todas las promociones</option>
        <option value="true">Solo vigentes</option>
      </select>

      {exito && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-2 text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-white shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Descuento</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Servicio</th>
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
                  Sin promociones por el momento
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((promocion) => (
                <tr key={promocion.id_promocion}>
                  <td className="px-4 py-3 text-gray-600">{promocion.id_promocion}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{promocion.titulo}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {promocion.descuento}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{promocion.fecha_inicio}</td>
                  <td className="px-4 py-3 text-gray-600">{promocion.fecha_fin}</td>
                  <td className="px-4 py-3 text-gray-600">{promocion.servicio || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/promociones/${promocion.id_promocion}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(promocion)}
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

export default Promociones;
