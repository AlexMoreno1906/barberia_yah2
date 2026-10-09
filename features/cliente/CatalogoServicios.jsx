import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarServiciosPortal } from "./portalApi";
import { FiScissors, FiArrowRight } from "react-icons/fi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function CatalogoServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listarServiciosPortal()
      .then((datos) => setServicios(datos.items))
      .catch(() => setError("No se pudieron cargar los servicios."))
      .finally(() => setCargando(false));
  }, []);

  const porCategoria = {};
  for (const servicio of servicios) {
    const categoria = servicio.categoria || "Otros servicios";
    if (!porCategoria[categoria]) porCategoria[categoria] = [];
    porCategoria[categoria].push(servicio);
  }

  return (
    <div className="space-y-10">
      {/* ENCABEZADO */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
          Catálogo completo
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Nuestros servicios
        </h1>
        <p className="text-gray-400 leading-relaxed">
          Explora todo lo que tenemos para ti. Elige lo que necesites y agenda tu turno al instante.
        </p>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 text-center max-w-md mx-auto">
          {error}
        </div>
      ) : servicios.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No hay servicios disponibles por el momento.</p>
      ) : (
        Object.entries(porCategoria).map(([categoria, items]) => (
          <section key={categoria}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <FiScissors className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">{categoria}</h2>
                <p className="text-gray-500 text-xs">{items.length} servicio{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((servicio) => (
                <div
                  key={servicio.id_servicio}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      {servicio.nombre}
                    </h3>
                    <span className="text-amber-500 font-bold text-lg whitespace-nowrap ml-3">
                      {formatearMoneda(servicio.precio)}
                    </span>
                  </div>
                  {servicio.descripcion && (
                    <p className="text-gray-400 text-sm leading-relaxed">{servicio.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/cliente/turno"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25"
        >
          Agendar mi turno ahora
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default CatalogoServicios;
