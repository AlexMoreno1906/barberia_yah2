import apiClient from "../../shared/config/apiClient";

export async function listarServiciosPortal() {
  const respuesta = await apiClient.get("/portal/servicios");
  return respuesta.data;
}

export async function listarBarberosPortal() {
  const respuesta = await apiClient.get("/portal/barberos");
  return respuesta.data;
}

export async function consultarDisponibilidadPortal(params = {}) {
  const respuesta = await apiClient.get("/portal/disponibilidad", { params });
  return respuesta.data;
}

export async function solicitarTurno(datos) {
  const respuesta = await apiClient.post("/portal/citas", datos);
  return respuesta.data;
}
