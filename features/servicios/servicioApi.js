import apiClient from "../../shared/config/apiClient";

export async function listarServicios(params = {}) {
  const respuesta = await apiClient.get("/servicios", { params });
  return respuesta.data;
}

export async function obtenerServicio(id) {
  const respuesta = await apiClient.get(`/servicios/${id}`);
  return respuesta.data;
}

export async function crearServicio(servicio) {
  const respuesta = await apiClient.post("/servicios", servicio);
  return respuesta.data;
}

export async function actualizarServicio(id, servicio) {
  const respuesta = await apiClient.put(`/servicios/${id}`, servicio);
  return respuesta.data;
}

export async function eliminarServicio(id) {
  const respuesta = await apiClient.delete(`/servicios/${id}`);
  return respuesta.data;
}
