import apiClient from "../../shared/config/apiClient";

export async function listarPagosPendientes(params = {}) {
  const respuesta = await apiClient.get("/pagos/pendientes", { params });
  return respuesta.data;
}

export async function listarPagosRecientes(params = {}) {
  const respuesta = await apiClient.get("/pagos/recientes", { params });
  return respuesta.data;
}

export async function registrarPago(pago) {
  const respuesta = await apiClient.post("/pagos", pago);
  return respuesta.data;
}
