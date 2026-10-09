import { useEffect, useState } from "react";

function BarraBusqueda({ valor, onBuscar, placeholder = "Buscar..." }) {
  const [texto, setTexto] = useState(valor || "");

  useEffect(() => {
    setTexto(valor || "");
  }, [valor]);

  function manejarEnvio(evento) {
    evento.preventDefault();
    onBuscar(texto.trim());
  }

  function limpiar() {
    setTexto("");
    onBuscar("");
  }

  return (
    <form onSubmit={manejarEnvio} className="flex items-center gap-2">
      <input
        type="search"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder={placeholder}
        className="w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Buscar
      </button>
      {texto && (
        <button
          type="button"
          onClick={limpiar}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2"
        >
          Limpiar
        </button>
      )}
    </form>
  );
}

export default BarraBusqueda;
