import apiClient from "../../shared/config/apiClient";

export async function listarCitas(params = {}) {
  const respuesta = await apiClient.get("/citas", { params });
  return respuesta.data;
}

export async function obtenerCita(id) {
  const respuesta = await apiClient.get(`/citas/${id}`);
  return respuesta.data;
}

export async function consultarDisponibilidad(params = {}) {
  const respuesta = await apiClient.get("/citas/disponibilidad", { params });
  return respuesta.data;
}

export async function crearCita(cita) {
  const respuesta = await apiClient.post("/citas", cita);
  return respuesta.data;
}

export async function actualizarCita(id, cita) {
  const respuesta = await apiClient.put(`/citas/${id}`, cita);
  return respuesta.data;
}

export async function eliminarCita(id) {
  const respuesta = await apiClient.delete(`/citas/${id}`);
  return respuesta.data;
}

export async function listarCitasPorFinalizar(params = {}) {
  const respuesta = await apiClient.get("/citas/por-finalizar", { params });
  return respuesta.data;
}

export async function finalizarCita(id, datos) {
  const respuesta = await apiClient.post(`/citas/${id}/finalizar`, datos);
  return respuesta.data;
}
