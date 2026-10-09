import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../shared/config/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // al arrancar la app se intenta recuperar la sesión guardada
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCargando(false);
      return;
    }

    apiClient
      .get("/perfil")
      .then((respuesta) => setUsuario(respuesta.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  async function iniciarSesion(correo, contrasena) {
    const datos = new URLSearchParams();
    datos.append("username", correo);
    datos.append("password", contrasena);

    const respuesta = await apiClient.post("/autenticacion/iniciar-sesion", datos, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("access_token", respuesta.data.access_token);

    const perfil = await apiClient.get("/perfil");
    setUsuario(perfil.data);
    return perfil.data;
  }

  async function registrar(nombre, correo, contrasena) {
    const datos = new URLSearchParams();
    datos.append("nombre", nombre);
    datos.append("correo", correo);
    datos.append("password", contrasena);

    const respuesta = await apiClient.post("/autenticacion/registro", datos, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("access_token", respuesta.data.access_token);

    const perfil = await apiClient.get("/perfil");
    setUsuario(perfil.data);
    return perfil.data;
  }

  async function registrarCliente(nombre, telefono, correo, contrasena) {
    const datos = new URLSearchParams();
    datos.append("nombre", nombre);
    datos.append("telefono", telefono);
    datos.append("correo", correo);
    datos.append("password", contrasena);

    const respuesta = await apiClient.post("/autenticacion/registro-cliente", datos, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("access_token", respuesta.data.access_token);

    const perfil = await apiClient.get("/perfil");
    setUsuario(perfil.data);
    return perfil.data;
  }

  function cerrarSesion() {
    // se avisa al servidor, aunque falle igual se limpia la sesión local
    apiClient.post("/autenticacion/cerrar-sesion").catch(() => {});
    localStorage.removeItem("access_token");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, registrar, registrarCliente, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
