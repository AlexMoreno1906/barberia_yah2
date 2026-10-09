import { Link } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";

// el menú depende del rol; si el rol no está contemplado, se usa el de barbero
const seccionesPorRol = {
  Administrador: [
    {
      titulo: "Principal",
      items: [{ nombre: "Inicio", ruta: "/" }],
    },
    {
      titulo: "Gestión",
      items: [
        { nombre: "Citas", ruta: "/citas" },
        { nombre: "Finalizar cita", ruta: "/citas/finalizar" },
        { nombre: "Ventas", ruta: "/ventas" },
        { nombre: "Registrar pago", ruta: "/pagos/registrar" },
        { nombre: "Clientes", ruta: "/clientes" },
        { nombre: "Barberos", ruta: "/barberos" },
        { nombre: "Sucursales", ruta: "/sucursales" },
        { nombre: "Calificaciones", ruta: "/calificaciones" },
      ],
    },
    {
      titulo: "Catálogo",
      items: [
        { nombre: "Servicios", ruta: "/servicios" },
        { nombre: "Productos", ruta: "/productos" },
        { nombre: "Promociones", ruta: "/promociones" },
        { nombre: "Métodos de pago", ruta: "/metodos-pago" },
        { nombre: "Categorías de servicios", ruta: "/categorias-servicios" },
        { nombre: "Categorías de productos", ruta: "/categorias-productos" },
      ],
    },
    {
      titulo: "Administración",
      items: [
        { nombre: "Usuarios", ruta: "/usuarios" },
        { nombre: "Roles", ruta: "/roles" },
      ],
    },
    {
      titulo: "Reportes",
      items: [
        { nombre: "Listados", ruta: "/reportes/listados" },
        { nombre: "Estadísticos", ruta: "/reportes/estadisticos" },
      ],
    },
  ],
  Barbero: [
    {
      titulo: "Principal",
      items: [{ nombre: "Inicio", ruta: "/" }],
    },
    {
      titulo: "Gestión",
      items: [
        { nombre: "Citas", ruta: "/citas" },
        { nombre: "Finalizar", ruta: "/citas/finalizar" },
        { nombre: "Clientes", ruta: "/clientes" },
        { nombre: "Sucursales", ruta: "/sucursales" },
        { nombre: "Calificaciones", ruta: "/calificaciones" },
      ],
    },
    {
      titulo: "Reportes",
      items: [
        { nombre: "Listados", ruta: "/reportes/listados" },
        { nombre: "Estadísticos", ruta: "/reportes/estadisticos" },
      ],
    },
  ],
};

function MenuLateral() {
  const { usuario } = useAuth();
  const secciones = seccionesPorRol[usuario?.rol] || seccionesPorRol.Barbero;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen p-4 hidden md:block sticky top-0 overflow-y-auto">
      <h2 className="text-lg font-bold text-amber-400 mb-1">Barbería Yah</h2>
      <p className="text-xs text-gray-400 mb-6">Estilo que impone</p>

      <nav>
        {secciones.map((seccion) => (
          <div key={seccion.titulo} className="mb-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 px-3 mb-1">
              {seccion.titulo}
            </p>
            <ul className="space-y-1">
              {seccion.items.map((elemento) => (
                <li key={elemento.nombre}>
                  <Link
                    to={elemento.ruta}
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-amber-400 transition-colors"
                  >
                    {elemento.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default MenuLateral;
