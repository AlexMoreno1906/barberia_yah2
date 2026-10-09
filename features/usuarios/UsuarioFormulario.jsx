import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { crearUsuario, actualizarUsuario, obtenerUsuario } from "./usuarioApi";
import { listarRoles } from "../roles/rolApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function UsuarioFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    password: "",
    id_rol: "",
  });
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarRoles({ tamano: 100 }).then((datos) => setRoles(datos.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerUsuario(id)
      .then((usuario) => {
        setFormulario({
          nombre: usuario.nombre,
          correo: usuario.correo,
          password: "",
          id_rol: usuario.id_rol,
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function cambiarCampo(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const datos = {
      nombre: formulario.nombre,
      correo: formulario.correo,
      id_rol: Number(formulario.id_rol),
    };

    if (formulario.password) {
      datos.password = formulario.password;
    }

    try {
      if (esEdicion) {
        await actualizarUsuario(id, datos);
      } else {
        await crearUsuario(datos);
      }
      navegar("/usuarios", {
        state: { mensaje: esEdicion ? "Usuario actualizado correctamente" : "Usuario creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="py-8 px-4 flex justify-center">
      <div className="bg-white rounded-xl p-6 max-w-lg shadow">
        <h1 className="text-xl font-bold text-indigo-600 mb-4">
          {esEdicion ? "Editar usuario" : "Nuevo usuario"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando formulario...</p>
        ) : (
          <form onSubmit={enviarFormulario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {esEdicion ? "Contraseña (dejar vacía para no cambiarla)" : "Contraseña"}
              </label>
              <input
                type="password"
                name="password"
                value={formulario.password}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required={!esEdicion}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                name="id_rol"
                value={formulario.id_rol}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Elegir rol...</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
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
                {enviando ? "Guardando..." : esEdicion ? "Actualizar datos" : "Crear cuenta"}
              </button>
              <Link
                to="/usuarios"
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

export default UsuarioFormulario;
