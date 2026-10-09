function ModalDetalle({ titulo, abierto, cargando, error, alCerrar, children }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
          <button
            type="button"
            onClick={alCerrar}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {cargando ? (
          <p className="p-6 text-gray-500">Cargando detalle...</p>
        ) : error ? (
          <p className="p-6 text-red-600">{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export default ModalDetalle;
