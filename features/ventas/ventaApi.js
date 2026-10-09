import apiClient from "../../shared/config/apiClient";

export async function listarVentas(params = {}) {
  const respuesta = await apiClient.get("/ventas", { params });
  return respuesta.data;
}

export async function obtenerVenta(id) {
  const respuesta = await apiClient.get(`/ventas/${id}`);
  return respuesta.data;
}

export async function crearVenta(venta) {
  const respuesta = await apiClient.post("/ventas", venta);
  return respuesta.data;
}
