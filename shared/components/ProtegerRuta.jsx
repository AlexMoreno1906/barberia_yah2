import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";

function ProtegerRuta({ roles = null }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Cargando sesión...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // si el usuario no tiene el rol que pide la ruta, se lo manda a su sección
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={usuario.rol === "Cliente" ? "/cliente" : "/"} replace />;
  }

  return <Outlet />;
}

export default ProtegerRuta;
