import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { useDetalle } from "../../shared/hooks/useDetalle";
import Paginacion from "../../shared/components/Paginacion";
import BarraBusqueda from "../../shared/components/BarraBusqueda";
import ModalDetalle from "../../shared/components/ModalDetalle";
import { listarClientes, eliminarCliente, obtenerCliente } from "./clienteApi";

function Clientes() {
  const location = useLocation();
  const [exito, setExito] = useState(location.state?.mensaje || "");

  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(""), 5000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  const { items, pagina, totalPaginas, total, cargando, error, aplicarBusqueda, irAPagina, eliminar } =
    usePaginado(listarClientes, {
      eliminador: (cliente) => eliminarCliente(cliente.id_cliente),
      confirmar: (cliente) => `¿Eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`,
    });
  const { detalle, cargando: detalleCargando, abrir: verDetalle, cerrar: cerrarDetalle } =
    useDetalle(obtenerCliente);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Clientes</h1>
          <p className="text-gray-500 text-sm">Base de clientes de la barbería</p>
        </div>
        <Link
          to="/clientes/nuevo"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nuevo cliente
        </Link>
      </div>

      <BarraBusqueda
        valor=""
        onBuscar={aplicarBusqueda}
        placeholder="Buscar por nombre, correo o teléfono..."
      />

      {error && (
        <div className="bg-red-100 text-red-700 rounded-md px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {exito && (
        <div className="bg-green-100 text-green-800 rounded-md px-4 py-2 text-sm flex items-center justify-between">
          <span>{exito}</span>
          <button type="button" onClick={() => setExito("")} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Registro</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cargando && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  Cargando datos...
                </td>
              </tr>
            )}

            {!cargando && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={6}>
                  La lista de clientes está vacía
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td className="px-4 py-3 text-gray-600">{cliente.id_cliente}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{cliente.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.telefono || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.correo || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.fecha_registro || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        title="Ver detalle"
                        className="text-gray-600 hover:text-blue-700"
                        onClick={() => verDetalle(cliente.id_cliente)}
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/clientes/${cliente.id_cliente}/editar`}
                        title="Editar"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => eliminar(cliente)}
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

      {detalle && (
        <ModalDetalle
          titulo="Detalle del cliente"
          abierto
          cargando={detalleCargando}
          error={detalle.error}
          alCerrar={cerrarDetalle}
        >
          {!detalle.error && (
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-800">{detalle.nombre}</p>
                </div>
                <div>
                  <p className="text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-800">{detalle.telefono || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Correo</p>
                  <p className="font-medium text-gray-800">{detalle.correo || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha de registro</p>
                  <p className="font-medium text-gray-800">{detalle.fecha_registro || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </ModalDetalle>
      )}
    </div>
  );
}

export default Clientes;
