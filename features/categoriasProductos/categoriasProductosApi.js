import apiClient from "../../shared/config/apiClient";

export async function listarCategoriasProductos(params = {}) {
  const respuesta = await apiClient.get("/categorias-productos", { params });
  return respuesta.data;
}

export async function obtenerCategoriaProducto(id) {
  const respuesta = await apiClient.get(`/categorias-productos/${id}`);
  return respuesta.data;
}

export async function crearCategoriaProducto(categoria) {
  const respuesta = await apiClient.post("/categorias-productos", categoria);
  return respuesta.data;
}

export async function actualizarCategoriaProducto(id, categoria) {
  const respuesta = await apiClient.put(`/categorias-productos/${id}`, categoria);
  return respuesta.data;
}

export async function eliminarCategoriaProducto(id) {
  const respuesta = await apiClient.delete(`/categorias-productos/${id}`);
  return respuesta.data;
}
