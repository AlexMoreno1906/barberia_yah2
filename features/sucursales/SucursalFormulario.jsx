import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";
import { crearSucursal, actualizarSucursal, obtenerSucursal } from "./sucursalApi";

function SucursalFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    obtenerSucursal(id)
      .then((sucursal) => {
        setForm({
          nombre: sucursal.nombre,
          direccion: sucursal.direccion,
          telefono: sucursal.telefono,
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      if (esEdicion) {
        await actualizarSucursal(id, form);
      } else {
        await crearSucursal(form);
      }
      navegar("/sucursales", {
        state: { mensaje: esEdicion ? "Sucursal actualizada correctamente" : "Sucursal creada correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 w-full max-w-md mx-auto shadow">
      <h1 className="text-lg font-semibold mb-4">
        {esEdicion ? "Editar sucursal" : "Nueva sucursal"}
      </h1>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {cargando ? (
        <em className="text-gray-400">cargando...</em>
      ) : (
        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la sucursal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teléfono"
              pattern="[0-9]{7,15}"
              title="Ingrese solo números (7 a 15 dígitos)"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {enviando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear sucursal"}
            </button>
            <Link
              to="/sucursales"
              className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default SucursalFormulario;
