import apiClient from "../../shared/config/apiClient";

export async function listarMetodosPago(params = {}) {
  const respuesta = await apiClient.get("/metodos-pago", { params });
  return respuesta.data;
}

export async function obtenerMetodoPago(id) {
  const respuesta = await apiClient.get(`/metodos-pago/${id}`);
  return respuesta.data;
}

export async function crearMetodoPago(metodo) {
  const respuesta = await apiClient.post("/metodos-pago", metodo);
  return respuesta.data;
}

export async function actualizarMetodoPago(id, metodo) {
  const respuesta = await apiClient.put(`/metodos-pago/${id}`, metodo);
  return respuesta.data;
}

export async function eliminarMetodoPago(id) {
  const respuesta = await apiClient.delete(`/metodos-pago/${id}`);
  return respuesta.data;
}
