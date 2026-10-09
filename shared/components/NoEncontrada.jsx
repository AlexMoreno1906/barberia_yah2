import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <p className="text-6xl font-bold text-gray-300 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Página no encontrada</h1>
      <p className="text-gray-500 text-sm mb-6">
        La dirección que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NoEncontrada;
