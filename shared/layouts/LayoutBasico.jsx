import { Outlet } from "react-router-dom";

function LayoutBasico() {
  // pantalla centrada, sin menú: login y registro
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
}

export default LayoutBasico;
