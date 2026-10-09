function Paginacion({ pagina, totalPaginas, total, irAPagina }) {
  if (totalPaginas <= 1) return null;

  // ventana de páginas alrededor de la actual
  const numeros = [];
  const desde = Math.max(1, pagina - 2);
  const hasta = Math.min(totalPaginas, pagina + 2);
  for (let i = desde; i <= hasta; i += 1) numeros.push(i);

  const claseBoton =
    "px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Página <span className="font-medium text-gray-800">{pagina}</span> de {totalPaginas} · {total} registros
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={pagina <= 1}
          onClick={() => irAPagina(pagina - 1)}
          className={`${claseBoton} ${pagina <= 1 ? "text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-50"}`}
        >
          Anterior
        </button>

        {numeros.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => irAPagina(n)}
            className={`${claseBoton} ${
              n === pagina
                ? "bg-amber-500 text-white border-amber-500"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          disabled={pagina >= totalPaginas}
          onClick={() => irAPagina(pagina + 1)}
          className={`${claseBoton} ${pagina >= totalPaginas ? "text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-50"}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Paginacion;
