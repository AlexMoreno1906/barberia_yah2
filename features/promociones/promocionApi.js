import apiClient from "../../shared/config/apiClient";

export async function listarPromociones(params = {}) {
  const respuesta = await apiClient.get("/promociones", { params });
  return respuesta.data;
}

export async function obtenerPromocion(id) {
  const respuesta = await apiClient.get(`/promociones/${id}`);
  return respuesta.data;
}

export async function crearPromocion(promocion) {
  const respuesta = await apiClient.post("/promociones", promocion);
  return respuesta.data;
}

export async function actualizarPromocion(id, promocion) {
  const respuesta = await apiClient.put(`/promociones/${id}`, promocion);
  return respuesta.data;
}

export async function eliminarPromocion(id) {
  const respuesta = await apiClient.delete(`/promociones/${id}`);
  return respuesta.data;
}
