import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import Paginacion from "../../shared/components/Paginacion";
import { listarProductos, eliminarProducto } from "./productoApi";
import { listarCategoriasProductos } from "../categoriasProductos/categoriasProductosApi";

function Productos() {
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
    aplicarBusqueda,
    aplicarFiltros,
    irAPagina,
    eliminar,
  } = usePaginado(listarProductos, {
      eliminador: (producto) => eliminarProducto(producto.id_producto),
      confirmar: (producto) => `¿Eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
    });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    listarCategoriasProductos({ tamano: 100 })
      .then((datos) => setCategorias(datos.items))
      .catch(() => {});
  }, []);

  function cambiarCategoria(evento) {
    aplicarFiltros({ ...filtros, id_categoria_producto: evento.target.value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Productos</h1>
          <p className="text-gray-500 text-sm">Inventario de productos a la venta</p>
        </div>
        <Link
          to="/productos/nuevo"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <BarraBusqueda valor="" onBuscar={aplicarBusqueda} placeholder="Buscar por nombre..." />
        <select
          value={filtros.id_categoria_producto || ""}
          onChange={cambiarCategoria}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria_producto} value={categoria.id_categoria_producto}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {exito && (
        <div
          style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}
          className="flex items-center justify-between"
        >
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="shadow-sm border border-gray-200 rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Categoría</th>
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
                  No hay productos para mostrar
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((producto) => (
                <tr key={producto.id_producto}>
                  <td className="px-4 py-3 text-gray-600">{producto.id_producto}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{producto.nombre}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    ${Number(producto.precio).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        producto.stock <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {producto.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{producto.categoria || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/productos/${producto.id_producto}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(producto)}
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

export default Productos;
