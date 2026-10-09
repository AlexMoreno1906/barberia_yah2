import axios from "axios";

// el proxy de Vite manda lo que empiece por /api al backend
export const API_BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// a cada petición se le agrega el token guardado y se descartan los filtros vacíos
apiClient.interceptors.request.use((config) => {
  if (config.params) {
    const limpios = {};
    for (const [clave, valor] of Object.entries(config.params)) {
      if (valor === "" || valor === null || valor === undefined) continue;
      limpios[clave] = valor;
    }
    config.params = limpios;
  }
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// si el token ya no sirve, lo descarta y manda al login
apiClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("access_token")) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
