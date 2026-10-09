import apiClient from "../../shared/config/apiClient";

export async function listarSucursales(params = {}) {
  const respuesta = await apiClient.get("/sucursales", { params });
  return respuesta.data;
}

export async function obtenerSucursal(id) {
  const respuesta = await apiClient.get(`/sucursales/${id}`);
  return respuesta.data;
}

export async function crearSucursal(sucursal) {
  const respuesta = await apiClient.post("/sucursales", sucursal);
  return respuesta.data;
}

export async function actualizarSucursal(id, sucursal) {
  const respuesta = await apiClient.put(`/sucursales/${id}`, sucursal);
  return respuesta.data;
}

// se usa desde el listado de sucursales
export async function eliminarSucursal(id) {
  const respuesta = await apiClient.delete(`/sucursales/${id}`);
  return respuesta.data;
}
