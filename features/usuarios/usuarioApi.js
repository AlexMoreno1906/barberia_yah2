import apiClient from "../../shared/config/apiClient";

export async function listarUsuarios(params = {}) {
  const respuesta = await apiClient.get("/usuarios", { params });
  return respuesta.data;
}

export async function obtenerUsuario(id) {
  const respuesta = await apiClient.get(`/usuarios/${id}`);
  return respuesta.data;
}

export async function crearUsuario(usuario) {
  const respuesta = await apiClient.post("/usuarios", usuario);
  return respuesta.data;
}

export async function actualizarUsuario(id, usuario) {
  const respuesta = await apiClient.put(`/usuarios/${id}`, usuario);
  return respuesta.data;
}

export async function eliminarUsuario(id) {
  const respuesta = await apiClient.delete(`/usuarios/${id}`);
  return respuesta.data;
}
