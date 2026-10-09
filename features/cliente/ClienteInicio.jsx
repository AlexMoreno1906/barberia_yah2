import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";
import { listarServiciosPortal, listarBarberosPortal } from "./portalApi";
import { FiScissors, FiStar, FiClock, FiMapPin, FiArrowRight, FiCheckCircle, FiShield, FiUsers } from "react-icons/fi";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

function ClienteInicio() {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [barberos, setBarberos] = useState([]);

  useEffect(() => {
    listarServiciosPortal()
      .then((d) => setServicios(d.items?.slice(0, 6) || []))
      .catch(() => {});
    listarBarberosPortal()
      .then((d) => setBarberos(d.items || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-amber-900/20 -mx-4 px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
            Bienvenido, {usuario?.nombre?.split(" ")[0] ?? "cliente"}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Tu estilo es tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              identidad
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            En <span className="text-white font-semibold">Barbería Yah</span> fusionamos la tradición
            con las tendencias modernas para que salgas siempre con el look que mereces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cliente/turno"
              className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center gap-2"
            >
              Agendar mi turno
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/cliente/servicios"
              className="text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 font-medium px-8 py-3.5 rounded-xl transition-all"
            >
              Ver catálogo de servicios
            </Link>
          </div>
        </div>
      </section>

      {/* LEMA + MISION */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
              Nuestra esencia
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              No solo cortamos cabello,
              <br />
              <span className="text-amber-400">creamos confianza.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Cada silla de Barbería Yah es un espacio de transformación. Escuchamos, aconsejamos y ejecutamos con precisión para que cada cliente se vaya sintiéndose mejor de lo que llegó.
            </p>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <FiCheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Más de 10 años de experiencia nos respaldan</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-8 space-y-6">
            <div>
              <p className="text-amber-400 font-semibold text-xs tracking-widest uppercase mb-2">Misión</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Brindar a cada cliente una experiencia de grooming excepcional, combinando técnicas
                profesionales con un ambiente cercano y moderno, superando siempre sus expectativas
                de estilo y atención.
              </p>
            </div>
            <div className="border-t border-gray-700/50 pt-6">
              <p className="text-amber-400 font-semibold text-xs tracking-widest uppercase mb-2">Visión</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Ser la barbería de referencia en la región, reconocida por la calidad humana y técnica
                de nuestro equipo, la innovación constante y la fidelidad de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
              La diferencia Yah
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              ¿Por qué elegirnos?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FiScissors className="w-6 h-6" />,
                titulo: "Barberos expertos",
                texto: "Profesionales certificados con años de experiencia en cortes clásicos y modernos.",
              },
              {
                icon: <FiClock className="w-6 h-6" />,
                titulo: "Turnos flexibles",
                texto: "Elige el día y la hora que mejor te convengan. Sin filas, sin esperas.",
              },
              {
                icon: <FiStar className="w-6 h-6" />,
                titulo: "Calidad garantizada",
                texto: "Productos premium y herramientas de primera para resultados impecables.",
              },
              {
                icon: <FiMapPin className="w-6 h-6" />,
                titulo: "Múltiples sedes",
                texto: "Tres ubicaciones estratégicas para que siempre tengas una Barbería Yah cerca.",
              },
            ].map((item) => (
              <div
                key={item.titulo}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      {servicios.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
                  Catálogo
                </p>
                <h2 className="text-3xl font-extrabold text-white">Servicios destacados</h2>
              </div>
              <Link
                to="/cliente/servicios"
                className="hidden sm:flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors"
              >
                Ver todo <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicios.map((servicio) => (
                <div
                  key={servicio.id_servicio}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-gray-900/80 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      {servicio.nombre}
                    </h3>
                    <span className="text-amber-500 font-bold text-lg whitespace-nowrap ml-3">
                      {formatearMoneda(servicio.precio)}
                    </span>
                  </div>
                  {servicio.descripcion && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{servicio.descripcion}</p>
                  )}
                  {servicio.categoria && (
                    <span className="inline-block text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                      {servicio.categoria}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Link
              to="/cliente/servicios"
              className="sm:hidden flex items-center justify-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-semibold mt-6 transition-colors"
            >
              Ver todos los servicios <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* NUESTRO EQUIPO */}
      {barberos.length > 0 && (
        <section className="py-20 px-4 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
                Equipo
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Conoce a nuestros barberos
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {barberos.slice(0, 6).map((barbero) => (
                <div
                  key={barbero.id_barbero}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">
                      {barbero.nombre.split(" ").map((p) => p.charAt(0)).slice(0, 2).join("").toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{barbero.nombre}</h3>
                  <p className="text-amber-400 text-sm mb-1">
                    {barbero.especialidad || "Estilos generales"}
                  </p>
                  {barbero.sucursal && (
                    <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
                      <FiMapPin className="w-3 h-3" /> {barbero.sucursal}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIOS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-semibold text-xs tracking-widest uppercase mb-3">
              Opiniones
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                nombre: "Sebastián M.",
                texto: "El mejor corte que me han hecho. La atención es de primera y el ambiente es increíble. ¡Ya soy fiel!",
                puntuacion: 5,
              },
              {
                nombre: "Valentina P.",
                texto: "Llevé a mi hermano y quedó encantado. Los barberos saben escuchar y te aconsejan qué va mejor con tu cara.",
                puntuacion: 5,
              },
              {
                nombre: "Diego A.",
                texto: "Pedí turno en línea y fue súper fácil. Sin esperas y el resultado fue exactamente lo que pedí. Muy recomendado.",
                puntuacion: 5,
              },
            ].map((testimonio) => (
              <div
                key={testimonio.nombre}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonio.puntuacion }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonio.texto}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-xs">
                      {testimonio.nombre.split(" ").map((p) => p.charAt(0)).join("")}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">{testimonio.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl px-8 py-16 shadow-2xl shadow-amber-500/20">
          <FiScissors className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿Listo para un nuevo look?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-lg mx-auto">
            Agenda tu turno ahora y descubre por qué somos la barbería preferida de la ciudad.
          </p>
          <Link
            to="/cliente/turno"
            className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Agendar mi turno
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ClienteInicio;
