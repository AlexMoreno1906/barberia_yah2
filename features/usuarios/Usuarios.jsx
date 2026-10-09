import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { listarUsuarios, eliminarUsuario } from "./usuarioApi";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import Paginacion from "../../shared/components/Paginacion";

const coloresRol = {
  Administrador: "bg-purple-100 text-purple-700",
  Barbero: "bg-blue-100 text-blue-700",
};

function Usuarios() {
  const ubicacion = useLocation();
  const [exito, setExito] = useState(ubicacion.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarUsuarios, {
      eliminador: (usuario) => eliminarUsuario(usuario.id_usuario),
      confirmar: (usuario) => `¿Eliminar al usuario "${usuario.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-violet-700">Usuarios</h1>
          <p className="text-gray-500 text-sm">Cuentas de acceso al sistema</p>
        </div>
        <Link
          to="/usuarios/nuevo"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo usuario
        </Link>
      </div>

      <BarraBusqueda valor="" onBuscar={aplicarBusqueda} placeholder="Buscar por nombre o correo..." />

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
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
                  No hay usuarios en el sistema
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((usuario) => {
                const estilo = coloresRol[usuario.rol] || "bg-gray-100 text-gray-600";
                return (
                  <tr key={usuario.id_usuario}>
                    <td className="px-4 py-3 text-gray-600">{usuario.id_usuario}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{usuario.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{usuario.correo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estilo}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/usuarios/${usuario.id_usuario}/editar`}
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </Link>
                        <button
                          type="button"
                          title="Eliminar"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => eliminar(usuario)}
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

export default Usuarios;
