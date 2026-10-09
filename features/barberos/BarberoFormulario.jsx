import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearBarbero, actualizarBarbero, obtenerBarbero } from "./barberoApi";
import { listarUsuarios } from "../usuarios/usuarioApi";
import { listarSucursales } from "../sucursales/sucursalApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function BarberoFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    especialidad: "",
    id_usuario: "",
    id_sucursal: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarUsuarios({ tamano: 1000 }).then((datos) => setUsuarios(datos.items)).catch(() => {});
    listarSucursales({ tamano: 1000 }).then((datos) => setSucursales(datos.items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerBarbero(id)
      .then((barbero) => {
        setFormulario({
          nombre: barbero.nombre,
          telefono: barbero.telefono || "",
          especialidad: barbero.especialidad || "",
          id_usuario: barbero.id_usuario ?? "",
          id_sucursal: barbero.id_sucursal ?? "",
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
      nombre: formulario.nombre,
      telefono: formulario.telefono || null,
      especialidad: formulario.especialidad || null,
      id_usuario: formulario.id_usuario ? Number(formulario.id_usuario) : null,
      id_sucursal: formulario.id_sucursal ? Number(formulario.id_sucursal) : null,
    };

    try {
      if (esEdicion) {
        await actualizarBarbero(id, datos);
      } else {
        await crearBarbero(datos);
      }
      navegar("/barberos", {
        state: { mensaje: esEdicion ? "Barbero actualizado correctamente" : "Barbero creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar barbero" : "Nuevo barbero"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del barbero"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formulario.telefono}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teléfono"
                pattern="[0-9]{7,15}"
                title="Ingrese solo números (7 a 15 dígitos)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <input
                type="text"
                name="especialidad"
                value={formulario.especialidad}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Corte clásico, barba, tintes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select
                name="id_usuario"
                value={formulario.id_usuario}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin asignar</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre} ({usuario.correo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
              <select
                name="id_sucursal"
                value={formulario.id_sucursal}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin asignar</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                    {sucursal.nombre} — {sucursal.direccion}
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
                {enviando ? "Guardando..." : esEdicion ? "Actualizar" : "Registrar"}
              </button>
              <Link
                to="/barberos"
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

export default BarberoFormulario;
