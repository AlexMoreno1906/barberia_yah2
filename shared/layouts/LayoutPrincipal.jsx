import { Outlet } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import Encabezado from "../components/Encabezado";

function LayoutPrincipal() {
  // menú lateral + encabezado fijos; el contenido de cada ruta se pinta abajo
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MenuLateral />

      <div className="flex-1 flex flex-col">
        <Encabezado />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutPrincipal;
