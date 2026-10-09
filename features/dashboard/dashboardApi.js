import apiClient from "../../shared/config/apiClient";

export async function obtenerResumenDashboard() {
  const respuesta = await apiClient.get("/dashboard/resumen");
  return respuesta.data;
}

export async function obtenerCitasProximas(params = {}) {
  const respuesta = await apiClient.get("/dashboard/citas-proximas", { params });
  return respuesta.data;
}
