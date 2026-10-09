import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { crearMetodoPago, actualizarMetodoPago, obtenerMetodoPago } from "./metodoPagoApi";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function MetodoPagoFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [data, setData] = useState({ nombre: "" });
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    obtenerMetodoPago(id)
      .then((metodo) => {
        setData({ nombre: metodo.nombre });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      if (esEdicion) {
        await actualizarMetodoPago(id, data);
      } else {
        await crearMetodoPago(data);
      }
      navegar("/metodos-pago", {
        state: { mensaje: esEdicion ? "Método de pago actualizado correctamente" : "Método de pago creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center py-12">
      <div className="bg-white rounded shadow-sm p-8 max-w-md">
        <h1 className="font-semibold text-lg text-gray-800 mb-5">
          {esEdicion ? "Editar método de pago" : "Nuevo método de pago"}
        </h1>

        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={data.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Efectivo, tarjeta, transferencia"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={enviando}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {enviando ? "Guardando..." : "Confirmar"}
              </button>
              {error && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
              <Link
                to="/metodos-pago"
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

export default MetodoPagoFormulario;
