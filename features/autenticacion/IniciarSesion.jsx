import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexto/AuthContext";
import { manejarErrorApi } from "../../shared/utils/manejarErrorApi";

function IniciarSesion() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const navegar = useNavigate();

  async function entrar(correo, clave) {
    setEnviando(true);
    setError("");

    try {
      const perfil = await iniciarSesion(correo, clave);
      navegar(perfil.rol === "Cliente" ? "/cliente" : "/");
    } catch (err) {
      setError(manejarErrorApi(err).message);
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    await entrar(correo, contrasena);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
      <h1 className="text-xl font-bold text-amber-600 mb-1 text-center">
        Barbería Yah
      </h1>

      <p className="text-sm text-gray-500 mb-6 text-center">
        Inicia sesión para gestionar tu barbería
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo
          </label>

          <input
            type="text"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>

          <input
            type="password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        ¿No tienes cuenta?{" "}
        <Link
          to="/registro"
          className="text-amber-600 hover:text-amber-700 font-medium"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

export default IniciarSesion;