import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import Paginacion from "../../shared/components/Paginacion";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import { listarBarberos, eliminarBarbero } from "./barberoApi";

function Barberos() {
  const ubicacion = useLocation();
  const [exito, setExito] = useState(ubicacion.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarBarberos, {
      eliminador: (barbero) => eliminarBarbero(barbero.id_barbero),
      confirmar: (barbero) => `¿Eliminar al barbero "${barbero.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Barberos</h1>
          <p className="text-gray-500 text-sm">Registro de barberos del equipo</p>
        </div>
        <Link
          to="/barberos/nuevo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo barbero
        </Link>
      </div>

      <BarraBusqueda
        valor=""
        onBuscar={aplicarBusqueda}
        placeholder="Buscar por nombre o especialidad..."
      />

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded px-3 py-2 text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Sucursal</th>
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
                  No hay barberos en el sistema
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((barbero) => (
                <tr key={barbero.id_barbero}>
                  <td className="px-4 py-3 text-gray-600">{barbero.id_barbero}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{barbero.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{barbero.telefono || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{barbero.especialidad || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{barbero.correo_usuario || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{barbero.sucursal || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/barberos/${barbero.id_barbero}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(barbero)}
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

export default Barberos;
