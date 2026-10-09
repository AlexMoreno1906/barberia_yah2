import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearServicio, actualizarServicio, obtenerServicio } from "./servicioApi";
import { listarCategoriasServicios } from "../categoriasServicios/categoriasServiciosApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function ServicioFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    id_categoria_servicio: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarCategoriasServicios({ tamano: 100 })
      .then((datos) => setCategorias(datos.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerServicio(id)
      .then((servicio) => {
        setFormulario({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion || "",
          precio: servicio.precio,
          id_categoria_servicio: servicio.id_categoria_servicio || "",
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function manejarCambio(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    const datos = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion || null,
      precio: Number(formulario.precio),
      id_categoria_servicio: formulario.id_categoria_servicio
        ? Number(formulario.id_categoria_servicio)
        : null,
    };

    try {
      if (esEdicion) {
        await actualizarServicio(id, datos);
      } else {
        await crearServicio(datos);
      }
      navegar("/servicios", {
        state: { mensaje: esEdicion ? "Servicio actualizado correctamente" : "Servicio creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar servicio" : "Nuevo servicio"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-md px-4 py-2 text-sm border-none mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando datos...</p>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Corte clásico"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detalle del servicio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={formulario.precio}
                onChange={manejarCambio}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="id_categoria_servicio"
                value={formulario.id_categoria_servicio}
                onChange={manejarCambio}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria_servicio} value={categoria.id_categoria_servicio}>
                    {categoria.nombre}
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
                {enviando ? "Guardando..." : "Guardar servicio"}
              </button>
              <Link
                to="/servicios"
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

export default ServicioFormulario;
