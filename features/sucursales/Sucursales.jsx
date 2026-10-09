import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import Paginacion from "../../shared/components/Paginacion";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import { listarSucursales, eliminarSucursal } from "./sucursalApi";

function Sucursales() {
  const location = useLocation();
  const [exito, setExito] = useState(location.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarSucursales, {
      eliminador: (sucursal) => eliminarSucursal(sucursal.id_sucursal),
      confirmar: (sucursal) => `¿Eliminar la sucursal "${sucursal.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sucursales</h1>
          <p className="text-gray-500 text-sm">Sedes de la barbería</p>
        </div>
        <Link
          to="/sucursales/nueva"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva sucursal
        </Link>
      </div>

      <BarraBusqueda
        valor=""
        onBuscar={aplicarBusqueda}
        placeholder="Buscar por nombre o dirección..."
      />

      {exito && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-4 py-2 text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-md px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={5}>
                  Cargando...
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={5}>
                  Aún no hay sucursales
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((sucursal) => (
                <tr key={sucursal.id_sucursal}>
                  <td className="px-4 py-3 text-gray-600">{sucursal.id_sucursal}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{sucursal.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{sucursal.direccion}</td>
                  <td className="px-4 py-3 text-gray-600">{sucursal.telefono}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/sucursales/${sucursal.id_sucursal}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(sucursal)}
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

export default Sucursales;
