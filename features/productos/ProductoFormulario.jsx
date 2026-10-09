import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";
import { listarCategoriasProductos } from "../categoriasProductos/categoriasProductosApi";
import { crearProducto, actualizarProducto, obtenerProducto } from "./productoApi";

function ProductoFormulario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navegar = useNavigate();

  const [campos, setCampos] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria_producto: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarCategoriasProductos({ tamano: 100 })
      .then((datos) => setCategorias(datos.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!esEdicion) return;

    obtenerProducto(id)
      .then((producto) => {
        setCampos({
          nombre: producto.nombre,
          descripcion: producto.descripcion || "",
          precio: producto.precio,
          stock: producto.stock,
          id_categoria_producto: producto.id_categoria_producto || "",
        });
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [id, esEdicion]);

  function actualizarCampo(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const payload = {
      nombre: campos.nombre,
      descripcion: campos.descripcion || null,
      precio: Number(campos.precio),
      stock: Number(campos.stock),
      id_categoria_producto: campos.id_categoria_producto
        ? Number(campos.id_categoria_producto)
        : null,
    };

    try {
      if (esEdicion) {
        await actualizarProducto(id, payload);
      } else {
        await crearProducto(payload);
      }
      navegar("/productos", {
        state: { mensaje: esEdicion ? "Producto actualizado correctamente" : "Producto creado correctamente" },
      });
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#f9fafb' }} className="flex justify-center py-8 px-4">
      <div className="rounded-lg border border-gray-200 p-6 max-w-lg mx-auto bg-white">
        <h1 className="text-xl font-bold text-blue-700 mb-6">
          {esEdicion ? "Editar producto" : "Nuevo producto"}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {cargando ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        ) : (
          <form onSubmit={enviarFormulario} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={campos.nombre}
                onChange={actualizarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Pomada fijadora"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={campos.descripcion}
                onChange={actualizarCampo}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detalle del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={campos.precio}
                onChange={actualizarCampo}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={campos.stock}
                onChange={actualizarCampo}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="id_categoria_producto"
                value={campos.id_categoria_producto}
                onChange={actualizarCampo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria_producto} value={categoria.id_categoria_producto}>
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
                {enviando ? "Guardando..." : esEdicion ? "Modificar" : "Registrar"}
              </button>
              <Link
                to="/productos"
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

export default ProductoFormulario;
