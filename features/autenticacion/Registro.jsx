import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function Registro() {
  const { registrarCliente } = useAuth();
  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    contrasena: "",
    confirmacion: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const navegar = useNavigate();

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError("");

    // si las dos contraseñas no cuadran, no vale la pena llamar a la API
    if (formulario.contrasena !== formulario.confirmacion) {
      setError("La contraseña y su confirmación no coinciden.");
      setEnviando(false);
      return;
    }

    try {
      await registrarCliente(
        formulario.nombre,
        formulario.telefono,
        formulario.correo,
        formulario.contrasena
      );
      navegar("/cliente");
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
      <h1 className="text-xl font-bold text-amber-600 mb-1 text-center">Crear tu cuenta</h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Regístrate como cliente para ver servicios y pedir tu turno
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={cambiarCampo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formulario.telefono}
            onChange={cambiarCampo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={cambiarCampo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formulario.contrasena}
            onChange={cambiarCampo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            name="confirmacion"
            value={formulario.confirmacion}
            onChange={cambiarCampo}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Repite la contraseña"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {enviando ? "Registrando..." : "Registrarme"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default Registro;
