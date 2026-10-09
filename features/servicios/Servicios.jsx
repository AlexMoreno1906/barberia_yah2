import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { listarServicios, eliminarServicio } from "./servicioApi";
import { listarCategoriasServicios } from "../categoriasServicios/categoriasServiciosApi";
import Paginacion from "../../shared/components/Paginacion";
import BarraBusqueda from "../../shared/components/BarraBusqueda";

function Servicios() {
  const ubicacion = useLocation();
  const [exito, setExito] = useState(ubicacion.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, filtros, cargando, error, aplicarBusqueda, aplicarFiltros, irAPagina, eliminar } =
    usePaginado(listarServicios, {
      eliminador: (servicio) => eliminarServicio(servicio.id_servicio),
      confirmar: (servicio) => `¿Eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`,
    });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    listarCategoriasServicios({ tamano: 100 })
      .then((datos) => setCategorias(datos.items))
      .catch(() => {});
  }, []);

  function cambiarCategoria(evento) {
    aplicarFiltros({ ...filtros, id_categoria_servicio: evento.target.value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Servicios</h1>
          <p className="text-gray-500 text-sm">Servicios que ofrece la barbería</p>
        </div>
        <Link
          to="/servicios/nuevo"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo servicio
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <BarraBusqueda
          valor=""
          onBuscar={aplicarBusqueda}
          placeholder="Buscar por nombre..."
        />
        <select
          value={filtros.id_categoria_servicio || ""}
          onChange={cambiarCategoria}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria_servicio} value={categoria.id_categoria_servicio}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {exito && (
        <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td colSpan={6}>
                  <span className="text-sm text-gray-400 italic">cargando servicios...</span>
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  Sin servicios por ahora
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((servicio) => (
                <tr key={servicio.id_servicio}>
                  <td className="px-4 py-3 text-gray-600">{servicio.id_servicio}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{servicio.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{servicio.descripcion || "—"}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    ${Number(servicio.precio).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{servicio.categoria || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/servicios/${servicio.id_servicio}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(servicio)}
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

export default Servicios;
