import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";

function Encabezado() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  function manejarSalida() {
    cerrarSesion();
    navegar("/login");
  }

  const iniciales = (usuario?.nombre || "U")
    .split(" ")
    .map((parte) => parte.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-md font-semibold text-gray-800">Barbería Yah</h1>
        <p className="text-xs text-gray-500">Sede: {usuario?.sucursal || "Principal"}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
            {iniciales}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-800">{usuario?.nombre || "Usuario"}</p>
            <p className="text-gray-500">{usuario?.rol || ""}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={manejarSalida}
          title="Cerrar sesión"
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium"
        >
          <FiLogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    </header>
  );
}

export default Encabezado;
