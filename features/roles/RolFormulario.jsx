import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { crearRol, actualizarRol, obtenerRol } from "./rolApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function RolFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({ nombre: "" });
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    obtenerRol(id)
      .then((rol) => {
        setFormulario({ nombre: rol.nombre });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function cambiarNombre(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      if (esEdicion) {
        await actualizarRol(id, formulario);
      } else {
        await crearRol(formulario);
      }
      navegar("/roles", {
        state: { mensaje: esEdicion ? "Rol actualizado correctamente" : "Rol creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-sm mx-auto">
        <h1 className="text-base font-bold text-gray-700 mb-4">
          {esEdicion ? "Editar rol" : "Nuevo rol"}
        </h1>

        {error && (
          <div className="border border-red-300 text-red-600 rounded-md p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <span className="text-sm text-gray-400">Cargando...</span>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarNombre}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Administrador"
                required
              />
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
                to="/roles"
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

export default RolFormulario;
