import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCalificacion, actualizarCalificacion, obtenerCalificacion } from "./calificacionApi";
import { listarClientes } from "../clientes/clienteApi";
import { listarCitas } from "../citas/citaApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function CalificacionFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    puntuacion: "",
    comentario: "",
    id_cliente: "",
    id_cita: "",
  });
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarClientes({ tamano: 1000 }).then((datos) => setClientes(datos.items)).catch(() => {});
    listarCitas({ tamano: 1000 }).then((datos) => setCitas(datos.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerCalificacion(id)
      .then((calificacion) => {
        setFormulario({
          puntuacion: calificacion.puntuacion,
          comentario: calificacion.comentario,
          id_cliente: calificacion.id_cliente,
          id_cita: calificacion.id_cita,
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    const datos = {
      puntuacion: Number(formulario.puntuacion),
      comentario: formulario.comentario,
      id_cliente: Number(formulario.id_cliente),
      id_cita: Number(formulario.id_cita),
    };

    try {
      if (esEdicion) {
        await actualizarCalificacion(id, datos);
      } else {
        await crearCalificacion(datos);
      }
      navegar("/calificaciones");
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-xl">
        <h1 className="text-xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar calificación" : "Nueva calificación"}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntuación (1 a 5)
              </label>
              <select
                name="puntuacion"
                value={formulario.puntuacion}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione</option>
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
                name="comentario"
                value={formulario.comentario}
                onChange={cambiarCampo}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu opinión sobre el servicio"
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Cita</label>
              <select
                name="id_cita"
                value={formulario.id_cita}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una cita</option>
                {citas.map((cita) => (
                  <option key={cita.id_cita} value={cita.id_cita}>
                    Cita #{cita.id_cita} — {cita.fecha} {cita.hora} ({cita.estado})
                  </option>
                ))}
              </select>
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
                to="/calificaciones"
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

export default CalificacionFormulario;
