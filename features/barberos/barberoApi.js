import apiClient from "../../shared/config/apiClient";

export async function listarBarberos(params = {}) {
  const respuesta = await apiClient.get("/barberos", { params });
  return respuesta.data;
}

export async function obtenerBarbero(id) {
  const respuesta = await apiClient.get(`/barberos/${id}`);
  return respuesta.data;
}

export async function crearBarbero(barbero) {
  const respuesta = await apiClient.post("/barberos", barbero);
  return respuesta.data;
}

export async function actualizarBarbero(id, barbero) {
  const respuesta = await apiClient.put(`/barberos/${id}`, barbero);
  return respuesta.data;
}

export async function eliminarBarbero(id) {
  const respuesta = await apiClient.delete(`/barberos/${id}`);
  return respuesta.data;
}
