import { useEffect, useState } from "react";
import { FiCheckCircle, FiCreditCard } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { listarPagosPendientes, listarPagosRecientes, registrarPago } from "./pagoApi";
import { listarMetodosPago } from "../metodosPago/metodoPagoApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function RegistrarPago() {
  const [parametros] = useSearchParams();

  const [ventas, setVentas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [recientes, setRecientes] = useState([]);

  const [idVenta, setIdVenta] = useState(parametros.get("venta") || "");
  const [idMetodo, setIdMetodo] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    cargarPendientes();
    listarPagosRecientes().then((datos) => setRecientes(datos.items)).catch(() => {});
    listarMetodosPago({ tamano: 100 }).then((datos) => setMetodos(datos.items)).catch(() => {});
  }, []);

  function cargarPendientes() {
    setCargando(true);
    listarPagosPendientes()
      .then((datos) => setVentas(datos.items))
      .catch(() => {})
      .finally(() => setCargando(false));
  }

  const ventaSeleccionada = ventas.find((v) => String(v.id_venta) === String(idVenta));

  function seleccionarVenta(evento) {
    const valor = evento.target.value;
    setIdVenta(valor);
    const venta = ventas.find((v) => String(v.id_venta) === String(valor));
    setMonto(venta ? String(venta.total) : "");
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");
    setExito("");

    if (!idVenta) {
      setError("Selecciona la venta a la que se le va a registrar el pago.");
      setEnviando(false);
      return;
    }

    if (!idMetodo) {
      setError("Selecciona el método de pago.");
      setEnviando(false);
      return;
    }

    if (!monto || Number(monto) <= 0) {
      setError("El monto debe ser mayor que cero.");
      setEnviando(false);
      return;
    }

    try {
      await registrarPago({
        id_venta: Number(idVenta),
        id_metodo_pago: Number(idMetodo),
        monto: Number(monto),
        fecha,
      });
      setExito(`Pago de ${formatearMoneda(monto)} registrado para la venta #${idVenta}.`);
      setIdVenta("");
      setMonto("");
      setIdMetodo("");
      setFecha(new Date().toISOString().slice(0, 10));
      listarPagosRecientes().then((datos) => setRecientes(datos.items)).catch(() => {});
      cargarPendientes();
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrar pago</h1>
        <p className="text-gray-500 text-sm">Proceso de caja para ventas pendientes de pago</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiCreditCard className="w-5 h-5 text-blue-600" />
            Nuevo pago
          </h2>

          {exito && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
              <FiCheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span>{exito}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venta pendiente
              </label>
              <select
                value={idVenta}
                onChange={seleccionarVenta}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona la venta</option>
                {ventas.map((venta) => (
                  <option key={venta.id_venta} value={venta.id_venta}>
                    Venta #{venta.id_venta} — {venta.nombre_cliente || "Sin cliente"} ({venta.fecha})
                  </option>
                ))}
              </select>
            </div>

            {ventaSeleccionada && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm space-y-1">
                <p className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-800">{ventaSeleccionada.nombre_cliente}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-medium text-gray-800">{ventaSeleccionada.fecha}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Total a pagar</span>
                  <span className="font-bold text-gray-900">{formatearMoneda(ventaSeleccionada.total)}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de pago
                </label>
                <select
                  value={idMetodo}
                  onChange={(e) => setIdMetodo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona el método</option>
                  {metodos.map((metodo) => (
                    <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                      {metodo.nombre}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                value={monto}
                min="1"
                step="0.01"
                onChange={(e) => setMonto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={enviando || cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {enviando ? "Registrando..." : "Registrar pago"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {/* panel derecho: últimos pagos como referencia rápida */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos pagos registrados</h2>

          {recientes.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Aún no hay pagos registrados</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-3 py-2.5">Fecha</th>
                  <th className="px-3 py-2.5">Cliente</th>
                  <th className="px-3 py-2.5">Método</th>
                  <th className="px-3 py-2.5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recientes.map((pago) => (
                  <tr key={pago.id_pago}>
                    <td className="px-3 py-2.5 text-gray-600">{pago.fecha}</td>
                    <td className="px-3 py-2.5 text-gray-800 font-medium">
                      {pago.nombre_cliente || "—"}
                      <span className="block text-xs text-gray-400">Venta #{pago.id_venta}</span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{pago.metodo_pago || "—"}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-gray-800">
                      {formatearMoneda(pago.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrarPago;
