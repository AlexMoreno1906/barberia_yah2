import apiClient from "../../shared/config/apiClient";

// todos los reportes son GETs y aceptan filtros opcionales por query string

export async function reporteCitas(params = {}) {
  const respuesta = await apiClient.get("/reportes/citas", { params });
  return respuesta.data;
}

export async function reporteVentas(params = {}) {
  const respuesta = await apiClient.get("/reportes/ventas", { params });
  return respuesta.data;
}

export async function reporteStock(params = {}) {
  const respuesta = await apiClient.get("/reportes/stock", { params });
  return respuesta.data;
}

export async function reporteClientes(params = {}) {
  const respuesta = await apiClient.get("/reportes/clientes", { params });
  return respuesta.data;
}

export async function reportePromociones(params = {}) {
  const respuesta = await apiClient.get("/reportes/promociones", { params });
  return respuesta.data;
}

export async function reporteVentasPorMes(params = {}) {
  const respuesta = await apiClient.get("/reportes/ventas-por-mes", { params });
  return respuesta.data;
}

export async function reporteCitasPorBarbero(params = {}) {
  const respuesta = await apiClient.get("/reportes/citas-por-barbero", { params });
  return respuesta.data;
}

export async function reporteCalificacionesPorPuntuacion(params = {}) {
  const respuesta = await apiClient.get("/reportes/calificaciones-por-puntuacion", { params });
  return respuesta.data;
}

export async function reporteServiciosMasSolicitados(params = {}) {
  const respuesta = await apiClient.get("/reportes/servicios-mas-solicitados", { params });
  return respuesta.data;
}

export async function reporteProductosMasVendidos(params = {}) {
  const respuesta = await apiClient.get("/reportes/productos-mas-vendidos", { params });
  return respuesta.data;
}
