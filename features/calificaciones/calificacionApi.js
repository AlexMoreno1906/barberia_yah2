import apiClient from "../../shared/config/apiClient";

export async function listarCalificaciones(params = {}) {
  const respuesta = await apiClient.get("/calificaciones", { params });
  return respuesta.data;
}

export async function obtenerCalificacion(id) {
  const respuesta = await apiClient.get(`/calificaciones/${id}`);
  return respuesta.data;
}

export async function crearCalificacion(calificacion) {
  const respuesta = await apiClient.post("/calificaciones", calificacion);
  return respuesta.data;
}

export async function actualizarCalificacion(id, calificacion) {
  const respuesta = await apiClient.put(`/calificaciones/${id}`, calificacion);
  return respuesta.data;
}

export async function eliminarCalificacion(id) {
  const respuesta = await apiClient.delete(`/calificaciones/${id}`);
  return respuesta.data;
}
