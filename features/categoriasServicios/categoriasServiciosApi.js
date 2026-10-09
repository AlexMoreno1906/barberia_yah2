import apiClient from "../../shared/config/apiClient";

export async function listarCategoriasServicios(params = {}) {
  const respuesta = await apiClient.get("/categorias-servicios", { params });
  return respuesta.data;
}

export async function obtenerCategoriaServicio(id) {
  const respuesta = await apiClient.get(`/categorias-servicios/${id}`);
  return respuesta.data;
}

export async function crearCategoriaServicio(categoria) {
  const respuesta = await apiClient.post("/categorias-servicios", categoria);
  return respuesta.data;
}

export async function actualizarCategoriaServicio(id, categoria) {
  const respuesta = await apiClient.put(`/categorias-servicios/${id}`, categoria);
  return respuesta.data;
}

export async function eliminarCategoriaServicio(id) {
  const respuesta = await apiClient.delete(`/categorias-servicios/${id}`);
  return respuesta.data;
}
