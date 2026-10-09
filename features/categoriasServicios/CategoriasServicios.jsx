import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import { listarCategoriasServicios, eliminarCategoriaServicio } from "./categoriasServiciosApi";
import Paginacion from "../../shared/components/Paginacion";

function CategoriasServicios() {
  const ubicacion = useLocation();
  const [exito, setExito] = useState(ubicacion.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarCategoriasServicios, {
      eliminador: (categoria) => eliminarCategoriaServicio(categoria.id_categoria_servicio),
      confirmar: (categoria) => `¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-700">Categorías de servicios</h1>
          <p className="text-gray-500 text-sm">Grupos para clasificar los servicios</p>
        </div>
        <Link
          to="/categorias-servicios/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva categoría
        </Link>
      </div>

      <BarraBusqueda valor="" onBuscar={aplicarBusqueda} placeholder="Buscar por nombre..." />

      {error && (
        <div className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {exito && (
        <div className="bg-green-50 text-green-600 px-3 py-2 rounded text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
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
                  Sin categorías registradas
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((categoria) => (
                <tr key={categoria.id_categoria_servicio}>
                  <td className="px-4 py-3 text-gray-600">{categoria.id_categoria_servicio}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{categoria.nombre}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/categorias-servicios/${categoria.id_categoria_servicio}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(categoria)}
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

export default CategoriasServicios;
