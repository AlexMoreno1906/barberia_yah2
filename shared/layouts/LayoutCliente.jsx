import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const enlaces = [
  { ruta: "/cliente", nombre: "Inicio" },
  { ruta: "/cliente/servicios", nombre: "Servicios" },
  { ruta: "/cliente/turno", nombre: "Pedir turno" },
];

function LayoutCliente() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function salir() {
    cerrarSesion();
    navegar("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/cliente" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-tight">Barbería Yah</span>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest">Estilo que impone</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.ruta === "/cliente"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                {enlace.nombre}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {(usuario?.nombre || "U").split(" ").map((p) => p.charAt(0)).slice(0, 2).join("").toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-300">{usuario?.nombre}</span>
            </div>
            <button
              onClick={salir}
              className="text-sm text-gray-500 hover:text-amber-400 transition-colors"
            >
              Salir
            </button>
          </div>

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {menuAbierto ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden border-t border-gray-800 px-4 py-2 space-y-1">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.ruta === "/cliente"}
                onClick={() => setMenuAbierto(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-amber-500 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {enlace.nombre}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">Y</span>
            </div>
            <span className="text-sm font-bold text-white">Barbería Yah</span>
          </div>
          <p className="text-gray-500 text-xs">
            Estilo que impone &copy; {new Date().getFullYear()} &mdash; Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LayoutCliente;
