import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import Paginacion from "../../shared/components/Paginacion";
import { listarRoles, eliminarRol } from "./rolApi";

function Roles() {
  const location = useLocation();
  const [exito, setExito] = useState(location.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, irAPagina, eliminar } =
    usePaginado(listarRoles, {
      eliminador: (rol) => eliminarRol(rol.id_rol),
      confirmar: (rol) => `¿Eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-800 uppercase tracking-wide">Roles</h1>
          <p className="text-gray-500 text-sm">Niveles de acceso del sistema</p>
        </div>
        <Link
          to="/roles/nuevo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo rol
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {exito && (
        <div className="bg-green-50 text-green-700 rounded px-3 py-2 text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={3}>
                  Cargando...
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={3}>
                  Sin roles
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((rol) => {
                return (
                  <tr key={rol.id_rol}>
                    <td className="px-4 py-3 text-gray-600">{rol.id_rol}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{rol.nombre}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/roles/${rol.id_rol}/editar`}
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </Link>
                        <button
                          type="button"
                          title="Eliminar"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => eliminar(rol)}
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
    </div>
  );
}

export default Roles;
