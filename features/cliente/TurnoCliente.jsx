import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listarBarberosPortal,
  listarServiciosPortal,
  consultarDisponibilidadPortal,
  solicitarTurno,
} from "./portalApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";
import { FiCheckCircle, FiArrowRight, FiCalendar, FiClock, FiUser } from "react-icons/fi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function TurnoCliente() {
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [fecha, setFecha] = useState("");
  const [idBarbero, setIdBarbero] = useState("");
  const [hora, setHora] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [cargandoDispo, setCargandoDispo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    listarBarberosPortal().then((res) => setBarberos(res.items)).catch(() => {});
    listarServiciosPortal().then((res) => setServicios(res.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setHora("");
    setDisponibilidad(null);
    if (!fecha || !idBarbero) return;
    setCargandoDispo(true);
    consultarDisponibilidadPortal({ fecha, id_barbero: idBarbero })
      .then(setDisponibilidad)
      .catch(() => setDisponibilidad({ disponibles: [], ocupadas: [], motivo: "" }))
      .finally(() => setCargandoDispo(false));
  }, [fecha, idBarbero]);

  function alternarServicio(idServicio) {
    setSeleccionados((previos) =>
      previos.includes(idServicio)
        ? previos.filter((s) => s !== idServicio)
        : [...previos, idServicio]
    );
  }

  const hoy = new Date().toISOString().split("T")[0];

  const totalSeleccionado = servicios
    .filter((s) => seleccionados.includes(s.id_servicio))
    .reduce((suma, s) => suma + Number(s.precio || 0), 0);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");

    if (seleccionados.length === 0) {
      setError("Selecciona al menos un servicio.");
      return;
    }
    if (!hora) {
      setError("Elige una hora disponible.");
      return;
    }

    setEnviando(true);
    try {
      const resultado = await solicitarTurno({
        fecha,
        hora,
        id_barbero: Number(idBarbero),
        servicios: seleccionados,
      });
      setConfirmacion(resultado);
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  function pedirOtroTurno() {
    setConfirmacion(null);
    setFecha("");
    setIdBarbero("");
    setHora("");
    setSeleccionados([]);
  }

  if (confirmacion) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
          <FiCheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Turno solicitado</h1>
        <p className="text-gray-400 mb-8">Tu cita quedó registrada y pendiente de confirmación.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiCalendar className="w-4 h-4 text-amber-500" />
              <span className="text-gray-400 text-sm w-20">Fecha</span>
              <span className="text-white font-medium text-sm">{confirmacion.fecha}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="w-4 h-4 text-amber-500" />
              <span className="text-gray-400 text-sm w-20">Hora</span>
              <span className="text-white font-medium text-sm">{confirmacion.hora}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiUser className="w-4 h-4 text-amber-500" />
              <span className="text-gray-400 text-sm w-20">Barbero</span>
              <span className="text-white font-medium text-sm">{confirmacion.barbero}</span>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 pt-4">
            <p className="text-gray-400 text-sm mb-1">Servicios</p>
            <p className="text-white text-sm">{confirmacion.servicios.join(", ")}</p>
          </div>
          <div className="border-t border-gray-800 mt-4 pt-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total</span>
            <span className="text-amber-500 font-bold text-xl">{formatearMoneda(confirmacion.total)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={pedirOtroTurno}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/25"
          >
            Pedir otro turno
          </button>
          <Link
            to="/cliente/servicios"
            className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 font-medium px-6 py-2.5 rounded-xl transition-all"
          >
            Ver servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ENCABEZADO */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
          Reserva rápida
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Pedir mi turno
        </h1>
        <p className="text-gray-400 leading-relaxed">
          Elige barbero, fecha y hora, y selecciona los servicios que deseas.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={manejarEnvio} className="space-y-6">
        {/* PASO 1: BARBERO Y FECHA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <span className="text-amber-500 font-bold text-sm">1</span>
            </div>
            <h2 className="font-bold text-white">Barbero y fecha</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Barbero</label>
              <select
                value={idBarbero}
                onChange={(evento) => setIdBarbero(evento.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Seleccione un barbero</option>
                {barberos.map((barbero) => (
                  <option key={barbero.id_barbero} value={barbero.id_barbero}>
                    {barbero.nombre} ({barbero.especialidad || "General"})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Fecha</label>
              <input
                type="date"
                min={hoy}
                value={fecha}
                onChange={(evento) => setFecha(evento.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* PASO 2: HORA */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <span className="text-amber-500 font-bold text-sm">2</span>
            </div>
            <h2 className="font-bold text-white">Hora disponible</h2>
          </div>
          {cargandoDispo ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Cargando horarios...</span>
            </div>
          ) : disponibilidad?.motivo ? (
            <p className="text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
              {disponibilidad.motivo}
            </p>
          ) : disponibilidad?.disponibles?.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No hay horarios disponibles para ese día.</p>
          ) : disponibilidad ? (
            <div className="flex flex-wrap gap-2">
              {disponibilidad.disponibles.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setHora(slot)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    hora === slot
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-amber-500/50 hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-4">
              Selecciona barbero y fecha para ver los horarios disponibles.
            </p>
          )}
        </div>

        {/* PASO 3: SERVICIOS */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-amber-500 font-bold text-sm">3</span>
              </div>
              <h2 className="font-bold text-white">Servicios</h2>
            </div>
            {seleccionados.length > 0 && (
              <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-medium">
                {seleccionados.length} seleccionado{seleccionados.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {servicios.length === 0 ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Cargando servicios...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {servicios.map((servicio) => (
                <label
                  key={servicio.id_servicio}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    seleccionados.includes(servicio.id_servicio)
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(servicio.id_servicio)}
                    onChange={() => alternarServicio(servicio.id_servicio)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="flex-1 text-sm text-white">{servicio.nombre}</span>
                  <span className="text-sm font-medium text-gray-400">
                    {formatearMoneda(servicio.precio)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* RESUMEN + BOTON */}
        {seleccionados.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total estimado</span>
              <span className="text-2xl font-extrabold text-white">{formatearMoneda(totalSeleccionado)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={enviando || seleccionados.length === 0 || !hora}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          {enviando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Solicitando turno...
            </>
          ) : (
            <>
              Solicitar turno
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default TurnoCliente;
