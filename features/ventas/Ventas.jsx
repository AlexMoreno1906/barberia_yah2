import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiPlus } from "react-icons/fi";
import { usePaginado } from "../../shared/hooks/usePaginado";
import { useDetalle } from "../../shared/hooks/useDetalle";
import Paginacion from "../../shared/components/Paginacion";
import ModalDetalle from "../../shared/components/ModalDetalle";
import { listarVentas, obtenerVenta } from "./ventaApi";
import { listarClientes } from "../clientes/clienteApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function Ventas() {
  const { items, pagina, totalPaginas, total, filtros, cargando, error, aplicarFiltros, irAPagina } =
    usePaginado(listarVentas);
  const { detalle, cargando: detalleCargando, abrir: verDetalle, cerrar: cerrarDetalle } =
    useDetalle(obtenerVenta);
  const [clientes, setClientes] = useState([]);
  const [ingresos, setIngresos] = useState(0);

  useEffect(() => {
    listarClientes({ tamano: 1000 })
      .then((datos) => setClientes(datos.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // el total de ingresos se recalcula con los mismos filtros del listado
    listarVentas({ pagina, tamano: 8, ...filtros })
      .then((datos) => setIngresos(datos.ingresos || 0))
      .catch(() => {});
  }, [pagina, filtros]);

  function cambiarCliente(evento) {
    aplicarFiltros({ ...filtros, id_cliente: evento.target.value });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ventas</h1>
          <p className="text-gray-500 text-sm">Registro de ventas de productos</p>
        </div>
        <Link
          to="/ventas/nueva"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nueva venta
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filtros.id_cliente || ""}
          onChange={cambiarCliente}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Todos los clientes</option>
          {clientes.map((cliente) => (
            <option key={cliente.id_cliente} value={cliente.id_cliente}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <div className="ml-auto bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-amber-700 font-semibold">Ingresos: {formatearMoneda(ingresos)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3 text-right">Detalle</th>
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
                  No hay ventas registradas.
                </td>
              </tr>
            )}

            {!cargando &&
              items.map((venta) => (
                <tr key={venta.id_venta}>
                  <td className="px-4 py-3 text-gray-600">{venta.id_venta}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{venta.fecha}</td>
                  <td className="px-4 py-3 text-gray-600">{venta.nombre_cliente || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{venta.cantidad_productos} línea(s)</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {formatearMoneda(venta.total)}
                  </td>
                  <td className="px-4 py-3">
                    {venta.pagada ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        Pagada
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      {!venta.pagada && (
                        <Link
                          to={`/pagos/registrar?venta=${venta.id_venta}`}
                          title="Registrar pago"
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Cobrar
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => verDetalle(venta.id_venta)}
                        title="Ver detalle"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FiEye className="w-4 h-4" />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Paginacion pagina={pagina} totalPaginas={totalPaginas} total={total} irAPagina={irAPagina} />
      </div>

      {/* el detalle de la venta se carga bajo demanda al pulsar "Ver" */}
      {detalle && (
        <ModalDetalle
          titulo={`Venta #${detalle.id_venta || ""}`}
          abierto
          cargando={detalleCargando}
          error={detalle.error}
          alCerrar={cerrarDetalle}
        >
          {!detalle.error && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium text-gray-800">{detalle.fecha}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-800">{detalle.nombre_cliente}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Productos</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase">
                      <th className="pb-2">Producto</th>
                      <th className="pb-2">Cantidad</th>
                      <th className="pb-2">Precio</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detalle.productos.map((linea) => (
                      <tr key={linea.id_detalle_venta}>
                        <td className="py-2">{linea.producto}</td>
                        <td className="py-2">{linea.cantidad}</td>
                        <td className="py-2">{formatearMoneda(linea.precio_unitario)}</td>
                        <td className="py-2 text-right font-medium">
                          {formatearMoneda(linea.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-2 text-right font-semibold text-gray-800">
                        Total
                      </td>
                      <td className="py-2 text-right font-bold text-gray-900">
                        {formatearMoneda(detalle.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {detalle.pago && (
                <div className="text-sm bg-gray-50 rounded-lg px-4 py-3">
                  <span className="text-gray-500">Pago: </span>
                  <span className="font-medium text-gray-800">{detalle.pago.metodo_pago}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span className="font-medium text-gray-800">
                    {formatearMoneda(detalle.pago.monto)}
                  </span>
                </div>
              )}
            </div>
          )}
        </ModalDetalle>
      )}
    </div>
  );
}

export default Ventas;
