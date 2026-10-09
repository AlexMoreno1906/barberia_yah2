import apiClient from "../../shared/config/apiClient";

export async function listarProductos(params = {}) {
  const respuesta = await apiClient.get("/productos", { params });
  return respuesta.data;
}

export async function obtenerProducto(id) {
  const respuesta = await apiClient.get(`/productos/${id}`);
  return respuesta.data;
}

export async function crearProducto(producto) {
  const respuesta = await apiClient.post("/productos", producto);
  return respuesta.data;
}

export async function actualizarProducto(id, producto) {
  const respuesta = await apiClient.put(`/productos/${id}`, producto);
  return respuesta.data;
}

export async function eliminarProducto(id) {
  const respuesta = await apiClient.delete(`/productos/${id}`);
  return respuesta.data;
}
