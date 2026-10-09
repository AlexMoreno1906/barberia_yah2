import { useState } from "react";

/**
 * Carga un registro por id para mostrarlo en un modal de detalle.
 * El cargador recibe el id y devuelve el registro completo.
 */
export function useDetalle(cargador) {
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function abrir(id) {
    setCargando(true);
    setDetalle(null);
    try {
      const datos = await cargador(id);
      setDetalle(datos);
    } catch {
      setDetalle({ error: "No se pudo cargar el detalle." });
    } finally {
      setCargando(false);
    }
  }

  function cerrar() {
    setDetalle(null);
    setCargando(false);
  }

  return { detalle, cargando, abrir, cerrar };
}
