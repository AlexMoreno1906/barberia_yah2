import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { crearVenta } from "./ventaApi";
import { listarClientes } from "../clientes/clienteApi";
import { listarProductos } from "../productos/productoApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function VentaFormulario() {
  const navegar = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [fecha, setFecha] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [lineas, setLineas] = useState([{ _key: 0, id_producto: "", cantidad: "1" }]);
  const siguienteKey = useRef(1);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFecha(new Date().toISOString().slice(0, 10));

    listarClientes({ tamano: 1000 }).then((datos) => setClientes(datos.items)).catch(() => {});
    listarProductos({ tamano: 1000 }).then((datos) => setProductos(datos.items)).catch(() => {});
  }, []);

  function cambiarLinea(indice, campo, valor) {
    setLineas((actuales) =>
      actuales.map((linea, i) => (i === indice ? { ...linea, [campo]: valor } : linea))
    );
  }

  function agregarLinea() {
    setLineas((actuales) => [...actuales, { _key: siguienteKey.current++, id_producto: "", cantidad: "1" }]);
  }

  function quitarLinea(indice) {
    setLineas((actuales) => actuales.filter((_, i) => i !== indice));
  }

  function obtenerProductoLinea(idProducto) {
    return productos.find((p) => String(p.id_producto) === String(idProducto));
  }

  // el total se calcula en vivo conforme se agregan productos
  const total = lineas.reduce((acumulado, linea) => {
    const producto = obtenerProductoLinea(linea.id_producto);
    if (!producto) return acumulado;
    return acumulado + Number(producto.precio) * (Number(linea.cantidad) || 0);
  }, 0);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    if (!idCliente) {
      setError("Selecciona un cliente.");
      setEnviando(false);
      return;
    }

    const productosSeleccionados = lineas
      .filter((linea) => linea.id_producto)
      .map((linea) => ({
        id_producto: Number(linea.id_producto),
        cantidad: Number(linea.cantidad) || 1,
      }));

    if (productosSeleccionados.length === 0) {
      setError("Agrega al menos un producto a la venta.");
      setEnviando(false);
      return;
    }

    try {
      await crearVenta({
        fecha,
        id_cliente: Number(idCliente),
        productos: productosSeleccionados,
      });
      navegar("/ventas");
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-3xl">
        <h1 className="text-xl font-bold text-blue-700 mb-6">Nueva venta</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">Productos</h2>
              <button
                type="button"
                onClick={agregarLinea}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <FiPlus className="w-4 h-4" />
                Agregar producto
              </button>
            </div>

            {lineas.map((linea, indice) => {
              const producto = obtenerProductoLinea(linea.id_producto);
              const subtotal = producto
                ? Number(producto.precio) * (Number(linea.cantidad) || 0)
                : 0;

              return (
                <div
                  key={linea._key}
                  className="flex flex-wrap items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2"
                >
                  <select
                    value={linea.id_producto}
                    onChange={(e) => cambiarLinea(indice, "id_producto", e.target.value)}
                    className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map((p) => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre} — {formatearMoneda(p.precio)} ({p.stock} disp.)
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={linea.cantidad}
                    min="1"
                    onChange={(e) => cambiarLinea(indice, "cantidad", e.target.value)}
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cant."
                  />

                  <span className="w-24 text-right text-sm font-medium text-gray-800">
                    {formatearMoneda(subtotal)}
                  </span>

                  <button
                    type="button"
                    onClick={() => quitarLinea(indice)}
                    disabled={lineas.length === 1}
                    title="Quitar línea"
                    className="text-red-600 hover:text-red-800 disabled:opacity-30"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-3">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatearMoneda(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Registrar venta"}
            </button>
            <Link to="/ventas" className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VentaFormulario;
