import apiClient from "../../shared/config/apiClient";

export async function listarRoles(params = {}) {
  const respuesta = await apiClient.get("/roles", { params });
  return respuesta.data;
}

export async function obtenerRol(id) {
  const respuesta = await apiClient.get(`/roles/${id}`);
  return respuesta.data;
}

export async function crearRol(rol) {
  const respuesta = await apiClient.post("/roles", rol);
  return respuesta.data;
}

export async function actualizarRol(id, rol) {
  const respuesta = await apiClient.put(`/roles/${id}`, rol);
  return respuesta.data;
}

export async function eliminarRol(id) {
  const respuesta = await apiClient.delete(`/roles/${id}`);
  return respuesta.data;
}
