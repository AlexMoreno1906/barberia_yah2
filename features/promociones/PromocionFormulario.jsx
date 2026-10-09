import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { crearPromocion, actualizarPromocion, obtenerPromocion } from "./promocionApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";
import { listarServicios } from "../servicios/servicioApi";

function PromocionFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: "",
    descuento: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_servicio: "",
  });
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarServicios({ tamano: 1000 })
      .then((datos) => setServicios(datos.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerPromocion(id)
      .then((promocion) => {
        setFormulario({
          titulo: promocion.titulo,
          descuento: promocion.descuento,
          fecha_inicio: promocion.fecha_inicio,
          fecha_fin: promocion.fecha_fin,
          id_servicio: promocion.id_servicio || "",
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

    if (formulario.fecha_fin < formulario.fecha_inicio) {
      setError("La fecha de fin no puede ser anterior a la de inicio.");
      setEnviando(false);
      return;
    }

    const datos = {
      titulo: formulario.titulo,
      descuento: Number(formulario.descuento),
      fecha_inicio: formulario.fecha_inicio,
      fecha_fin: formulario.fecha_fin,
      id_servicio: formulario.id_servicio ? Number(formulario.id_servicio) : null,
    };

    try {
      if (esEdicion) {
        await actualizarPromocion(id, datos);
      } else {
        await crearPromocion(datos);
      }
      navegar("/promociones", {
        state: { mensaje: esEdicion ? "Promoción actualizada correctamente" : "Promoción creada correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="font-bold text-xl mb-4">
          {esEdicion ? "Editar promoción" : "Nueva promoción"}
        </h1>

        {error && (
          <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={formulario.titulo}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Corte + barba en oferta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                name="descuento"
                value={formulario.descuento}
                onChange={cambiarCampo}
                min="1"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input
                type="date"
                name="fecha_inicio"
                value={formulario.fecha_inicio}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input
                type="date"
                name="fecha_fin"
                value={formulario.fecha_fin}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
              <select
                name="id_servicio"
                value={formulario.id_servicio}
                onChange={cambiarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id_servicio} value={servicio.id_servicio}>
                    {servicio.nombre}
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
                {enviando ? "Guardando..." : esEdicion ? "Actualizar promoción" : "Publicar promoción"}
              </button>
              <Link
                to="/promociones"
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

export default PromocionFormulario;
