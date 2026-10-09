import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";
import {
  crearCategoriaProducto,
  actualizarCategoriaProducto,
  obtenerCategoriaProducto,
} from "./categoriasProductosApi";

function CategoriaProductoFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [nombreCat, setNombreCat] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    obtenerCategoriaProducto(id)
      .then((categoria) => {
        setNombreCat(categoria.nombre);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function handleChange(e) {
    setNombreCat(e.target.value);
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      if (esEdicion) {
        await actualizarCategoriaProducto(id, { nombre: nombreCat });
      } else {
        await crearCategoriaProducto({ nombre: nombreCat });
      }
      navegar("/categorias-productos", {
        state: { mensaje: esEdicion ? "Categoría actualizada correctamente" : "Categoría creada correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="border border-gray-200 rounded-lg p-6 bg-white max-w-sm mx-auto">
        <h1 className="font-bold text-gray-700 text-lg mb-5">
          {esEdicion ? "Editar categoría" : "Nueva categoría de productos"}
        </h1>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
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
                value={nombreCat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Cuidado del cabello, afeitado"
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
                to="/categorias-productos"
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

export default CategoriaProductoFormulario;
