import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { crearCliente, actualizarCliente, obtenerCliente } from "./clienteApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function ClienteFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    obtenerCliente(id)
      .then((cliente) => {
        setDatos({
          nombre: cliente.nombre,
          telefono: cliente.telefono || "",
          correo: cliente.correo || "",
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function handleChange(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    const payload = {
      nombre: datos.nombre,
      telefono: datos.telefono || null,
      correo: datos.correo || null,
    };

    try {
      if (esEdicion) {
        await actualizarCliente(id, payload);
      } else {
        await crearCliente(payload);
      }
      navegar("/clientes", {
        state: { mensaje: esEdicion ? "Cliente actualizado correctamente" : "Cliente creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex items-start justify-center pt-8">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar cliente" : "Nuevo cliente"}
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={datos.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={datos.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teléfono"
                pattern="[0-9]{7,15}"
                title="Ingrese solo números (7 a 15 dígitos)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={datos.correo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
              />
              <p className="text-xs text-gray-400 mt-1">Se usará para notificaciones</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={enviando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {enviando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar cliente"}
              </button>
              <Link
                to="/clientes"
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

export default ClienteFormulario;
