import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import Paginacion from "../../shared/components/Paginacion";
import { listarCategoriasProductos, eliminarCategoriaProducto } from "./categoriasProductosApi";

function CategoriasProductos() {
  const location = useLocation();
  const [exito, setExito] = useState(location.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarCategoriasProductos, {
      eliminador: (categoria) => eliminarCategoriaProducto(categoria.id_categoria_producto),
      confirmar: (categoria) => `¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Categorías de productos</h1>
          <p className="text-gray-500 text-sm">Grupos para clasificar los productos</p>
        </div>
        <Link
          to="/categorias-productos/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva categoría
        </Link>
      </div>

      <BarraBusqueda valor="" onBuscar={aplicarBusqueda} placeholder="Buscar por nombre..." />

      {exito && (
        <div className="bg-green-50 text-green-700 px-4 py-2 text-sm rounded-lg flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
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
                  Aún no hay categorías
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((categoria) => (
                <tr key={categoria.id_categoria_producto}>
                  <td className="px-4 py-3 text-gray-600">{categoria.id_categoria_producto}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{categoria.nombre}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/categorias-productos/${categoria.id_categoria_producto}/editar`}
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

export default CategoriasProductos;
