import apiClient from "../../shared/config/apiClient";

export async function listarClientes(params = {}) {
  const respuesta = await apiClient.get("/clientes", { params });
  return respuesta.data;
}

export async function obtenerCliente(id) {
  const respuesta = await apiClient.get(`/clientes/${id}`);
  return respuesta.data;
}

export async function crearCliente(cliente) {
  const respuesta = await apiClient.post("/clientes", cliente);
  return respuesta.data;
}

export async function actualizarCliente(id, cliente) {
  const respuesta = await apiClient.put(`/clientes/${id}`, cliente);
  return respuesta.data;
}

export async function eliminarCliente(id) {
  const respuesta = await apiClient.delete(`/clientes/${id}`);
  return respuesta.data;
}
