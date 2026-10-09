import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCita, actualizarCita, obtenerCita, consultarDisponibilidad } from "./citaApi";
import { listarClientes } from "../clientes/clienteApi";
import { listarBarberos } from "../barberos/barberoApi";
import { listarServicios } from "../servicios/servicioApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function CitaFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    fecha: "",
    hora: "",
    estado: "pendiente",
    id_cliente: "",
    id_barbero: "",
    servicios: [],
  });
  const [clientes, setClientes] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [ocupadas, setOcupadas] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // catálogos para los desplegables del formulario
    listarClientes({ tamano: 1000 }).then((res) => setClientes(res.items)).catch(() => {});
    listarBarberos({ tamano: 1000 }).then((res) => setBarberos(res.items)).catch(() => {});
    listarServicios({ tamano: 1000 }).then((res) => setServicios(res.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerCita(id)
      .then((cita) => {
        setFormulario({
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          id_cliente: cita.id_cliente,
          id_barbero: cita.id_barbero,
          servicios: cita.servicios.map((servicio) => servicio.id_servicio),
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  useEffect(() => {
    // al cambiar fecha o barbero, consultamos qué horas ya están ocupadas
    if (!formulario.fecha || !formulario.id_barbero) {
      setOcupadas([]);
      return;
    }
    consultarDisponibilidad({ fecha: formulario.fecha, id_barbero: formulario.id_barbero })
      .then((res) => setOcupadas(res.ocupadas))
      .catch(() => setOcupadas([]));
  }, [formulario.fecha, formulario.id_barbero]);

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function alternarServicio(idServicio) {
    const seleccionados = formulario.servicios.includes(idServicio)
      ? formulario.servicios.filter((s) => s !== idServicio)
      : [...formulario.servicios, idServicio];
    setFormulario({ ...formulario, servicios: seleccionados });
  }

  const horarioOcupado = ocupadas.includes(formulario.hora);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    if (formulario.servicios.length === 0) {
      setError("Debe seleccionar al menos un servicio.");
      setEnviando(false);
      return;
    }

    if (horarioOcupado) {
      setError("El barbero ya tiene una cita a esa hora.");
      setEnviando(false);
      return;
    }

    const datos = {
      fecha: formulario.fecha,
      hora: formulario.hora,
      estado: formulario.estado,
      id_cliente: Number(formulario.id_cliente),
      id_barbero: Number(formulario.id_barbero),
      servicios: formulario.servicios,
    };

    try {
      if (esEdicion) {
        await actualizarCita(id, datos);
      } else {
        await crearCita(datos);
      }
      navegar("/citas");
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-2xl">
        <h1 className="text-xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar cita" : "Nueva cita"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={cambiarCampo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={formulario.hora}
                  onChange={cambiarCampo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {horarioOcupado && (
                  <p className="text-xs text-red-600 mt-1">Hora ya reservada</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={cambiarCampo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  name="id_cliente"
                  value={formulario.id_cliente}
                  onChange={cambiarCampo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre} ({cliente.correo || "sin correo"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barbero</label>
                <select
                  name="id_barbero"
                  value={formulario.id_barbero}
                  onChange={cambiarCampo}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
              {servicios.length === 0 ? (
                <p className="text-gray-400 text-sm">Cargando servicios...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {servicios.map((servicio) => (
                    <label
                      key={servicio.id_servicio}
                      className={`flex items-center gap-3 border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                        formulario.servicios.includes(servicio.id_servicio)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formulario.servicios.includes(servicio.id_servicio)}
                        onChange={() => alternarServicio(servicio.id_servicio)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="flex-1 text-sm text-gray-700">{servicio.nombre}</span>
                      <span className="text-sm font-medium text-gray-500">
                        ${Number(servicio.precio).toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={enviando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {enviando ? "Guardando..." : "Guardar"}
              </button>
              <Link
                to="/citas"
                className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CitaFormulario;
