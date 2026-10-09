// convierte el error de axios en un mensaje legible según lo que manda el servidor
export function manejarErrorApi(error) {
  const datos = error.response?.data;
  let mensaje = "Ocurrió un error al comunicarse con el servidor";

  if (datos?.detail) mensaje = datos.detail;
  else if (datos?.errores?.length) {
    mensaje = datos.errores
      .map((err) => `${err.campo}: ${err.mensaje}`)
      .join(" | ");
  } else if (datos?.mensaje) {
    mensaje = datos.mensaje;
  } else if (error.message) {
    mensaje = error.message;
  }

  return new Error(mensaje);
}
