import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carga listas paginadas del backend y maneja búsqueda, filtros y borrado.
 * El cargador recibe un objeto { pagina, tamano, busqueda, ...filtros } y
 * devuelve la respuesta con { items, total, total_paginas }.
 */
export function usePaginado(cargador, opciones = {}) {
  const tamano = opciones.tamano || 8;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ref para no recrear 'cargar' cuando cambia la referencia del cargador
  const cargadorRef = useRef(cargador);
  cargadorRef.current = cargador;

  const cargar = useCallback(
    async (pag, texto, filtrosActuales) => {
      setCargando(true);
      setError("");
      try {
        const datos = await cargadorRef.current({
          pagina: pag,
          tamano,
          busqueda: texto,
          ...filtrosActuales,
        });
        setItems(datos.items || []);
        setTotal(datos.total || 0);
        setTotalPaginas(datos.total_paginas || 0);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    },
    [tamano]
  );

  useEffect(() => {
    cargar(pagina, busqueda, filtros);
  }, [pagina, busqueda, filtros, cargar]);

  function irAPagina(nueva) {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  }

  function aplicarBusqueda(texto) {
    setPagina(1);
    setBusqueda(texto);
  }

  function aplicarFiltros(nuevos) {
    setPagina(1);
    setFiltros(nuevos);
  }

  function refrescar() {
    cargar(pagina, busqueda, filtros);
  }

  async function eliminar(item) {
    if (!opciones.eliminador) return;

    const confirmacion = opciones.confirmar
      ? opciones.confirmar(item)
      : "¿Desea eliminar este registro? Esta acción no se puede deshacer.";

    if (!window.confirm(confirmacion)) return;

    try {
      await opciones.eliminador(item);
      refrescar();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el registro.");
    }
  }

  return {
    items,
    total,
    pagina,
    totalPaginas,
    busqueda,
    filtros,
    cargando,
    error,
    irAPagina,
    aplicarBusqueda,
    aplicarFiltros,
    refrescar,
    eliminar,
  };
}
