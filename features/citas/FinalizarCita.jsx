import { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiFlag } from "react-icons/fi";
import { listarCitasPorFinalizar, obtenerCita, finalizarCita } from "./citaApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function FinalizarCita() {
  const [citas, setCitas] = useState([]);
  const [idCita, setIdCita] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [puntuacion, setPuntuacion] = useState("5");
  const [comentario, setComentario] = useState("");

  const [cargando, setCargando] = useState(true);
  const [detalleCargando, setDetalleCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarCitas = useCallback(() => {
    setCargando(true);
    listarCitasPorFinalizar()
      .then((datos) => setCitas(datos.items))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  async function seleccionarCita(evento) {
    const valor = evento.target.value;
    setIdCita(valor);
    setDetalle(null);
    setExito("");
    if (!valor) return;

    setDetalleCargando(true);
    try {
      const cita = await obtenerCita(valor);
      setDetalle(cita);
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setDetalleCargando(false);
    }
  }

  const totalServicios =
    detalle?.servicios?.reduce((suma, s) => suma + Number(s.precio || 0), 0) || 0;

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");
    setExito("");

    if (!idCita) {
      setError("Selecciona la cita que se va a finalizar.");
      setEnviando(false);
      return;
    }

    if (!comentario.trim()) {
      setError("Escribe un comentario sobre el servicio realizado.");
      setEnviando(false);
      return;
    }

    try {
      await finalizarCita(idCita, {
        puntuacion: Number(puntuacion),
        comentario: comentario.trim(),
      });
      setExito(`Cita #${idCita} finalizada. La calificación quedó registrada.`);
      // dejamos el formulario limpio y recargamos para que la cita salga de la lista
      setIdCita("");
      setDetalle(null);
      setComentario("");
      setPuntuacion("5");
      cargarCitas();
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finalizar cita</h1>
        <p className="text-gray-500 text-sm">
          Cierre de cita: marca como completada y registra la calificación del cliente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiFlag className="w-5 h-5 text-blue-600" />
            Cierre de cita
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Cita</label>
              {cargando ? (
                <p className="text-gray-500 text-sm">Cargando citas...</p>
              ) : citas.length === 0 ? (
                <p className="text-gray-400 text-sm">No hay citas pendientes o confirmadas.</p>
              ) : (
                <select
                  value={idCita}
                  onChange={seleccionarCita}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona la cita</option>
                  {citas.map((cita) => (
                    <option key={cita.id_cita} value={cita.id_cita}>
                      Cita #{cita.id_cita} — {cita.fecha} {cita.hora} ·{" "}
                      {cita.nombre_cliente || "Cliente"} ({cita.estado})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {detalleCargando ? (
              <p className="text-gray-500 text-sm">Cargando detalle de la cita...</p>
            ) : detalle ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm space-y-1">
                <p className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-800">{detalle.nombre_cliente}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Barbero</span>
                  <span className="font-medium text-gray-800">{detalle.nombre_barbero}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Servicios</span>
                  <span className="font-medium text-gray-800">
                    {detalle.servicios.map((s) => s.nombre).join(", ") || "—"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Total estimado</span>
                  <span className="font-bold text-gray-900">{formatearMoneda(totalServicios)}</span>
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puntuación (1 a 5)
                </label>
                <select
                  value={puntuacion}
                  onChange={(e) => setPuntuacion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 - Muy malo</option>
                  <option value="2">2 - Malo</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Bueno</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cómo quedó el servicio"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando || cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {enviando ? "Finalizando..." : "Finalizar cita"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Citas por finalizar</h2>

          {cargando ? (
            <p className="text-gray-500">Cargando...</p>
          ) : citas.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No hay citas pendientes</p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {citas.map((cita) => (
                <li
                  key={cita.id_cita}
                  className="flex items-center justify-between py-2.5"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Cita #{cita.id_cita} · {cita.nombre_cliente || "Cliente"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {cita.fecha} · {cita.hora} · {cita.nombre_barbero || "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      cita.estado === "confirmada"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinalizarCita;
