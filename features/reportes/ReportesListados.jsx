import { useEffect, useState } from "react";
import {
  reporteCitas,
  reporteVentas,
  reporteStock,
  reporteClientes,
  reportePromociones,
} from "./reporteApi";
import { listarBarberos } from "../barberos/barberoApi";
import { listarCategoriasProductos } from "../categoriasProductos/categoriasProductosApi";
import Paginacion from "../../shared/components/Paginacion";

function formatearMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
}

// estados que maneja el backend; se usan para el filtro de citas
const ESTADOS_CITA = ["pendiente", "confirmada", "completada", "cancelada"];

function ReportesListados() {
  const [seccion, setSeccion] = useState("citas");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reportes de listado</h1>
        <p className="text-gray-500 text-sm">Consultas con filtros y totales</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "citas", etiqueta: "Citas" },
          { id: "ventas", etiqueta: "Ventas" },
          { id: "stock", etiqueta: "Stock" },
          { id: "clientes", etiqueta: "Clientes" },
          { id: "promociones", etiqueta: "Promociones" },
        ].map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => setSeccion(opcion.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              seccion === opcion.id
                ? "bg-amber-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      {seccion === "citas" && <ReporteCitas />}
      {seccion === "ventas" && <ReporteVentas />}
      {seccion === "stock" && <ReporteStock />}
      {seccion === "clientes" && <ReporteClientes />}
      {seccion === "promociones" && <ReportePromociones />}
    </div>
  );
}

function ReporteCitas() {
  const [filtros, setFiltros] = useState({ fecha_inicio: "", fecha_fin: "", estado: "", id_barbero: "" });
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState({ items: [], total: 0, total_paginas: 0, por_estado: [] });
  const [barberos, setBarberos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    listarBarberos({ tamano: 100 }).then((r) => setBarberos(r.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    reporteCitas({ ...filtros, pagina, tamano: 10 })
      .then((r) => setDatos(r))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [filtros, pagina]);

  function cambiarFiltro(campo, valor) {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => cambiarFiltro("fecha_inicio", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => cambiarFiltro("fecha_fin", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => cambiarFiltro("estado", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            {ESTADOS_CITA.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Barbero</label>
          <select
            value={filtros.id_barbero}
            onChange={(e) => cambiarFiltro("id_barbero", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            {barberos.map((b) => (
              <option key={b.id_barbero} value={b.id_barbero}>{b.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {datos.por_estado.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {datos.por_estado.map((e) => (
            <span key={e.estado} className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
              {e.estado}: <b>{e.cantidad}</b>
            </span>
          ))}
        </div>
      )}

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : datos.items.length === 0 ? (
        <p className="text-gray-500">Sin resultados para el filtro.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Barbero</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {datos.items.map((cita) => (
              <tr key={cita.id_cita}>
                <td className="px-4 py-3">{cita.fecha}</td>
                <td className="px-4 py-3">{cita.hora}</td>
                <td className="px-4 py-3">{cita.cliente || "—"}</td>
                <td className="px-4 py-3">{cita.barbero || "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    {cita.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Paginacion pagina={pagina} totalPaginas={datos.total_paginas} total={datos.total} irAPagina={setPagina} />
    </div>
  );
}

function ReporteVentas() {
  const [filtros, setFiltros] = useState({ fecha_inicio: "", fecha_fin: "" });
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState({ items: [], total: 0, total_paginas: 0, ingresos: 0, promedio: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    reporteVentas({ ...filtros, pagina, tamano: 10 })
      .then((r) => setDatos(r))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [filtros, pagina]);

  function cambiarFiltro(campo, valor) {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => cambiarFiltro("fecha_inicio", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => cambiarFiltro("fecha_fin", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1">
          Ingresos: <b>{formatearMoneda(datos.ingresos)}</b>
        </span>
        <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
          Promedio por venta: <b>{formatearMoneda(datos.promedio)}</b>
        </span>
        <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
          Total ventas: <b>{datos.total}</b>
        </span>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : datos.items.length === 0 ? (
        <p className="text-gray-500">Sin resultados para el filtro.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {datos.items.map((venta) => (
              <tr key={venta.id_venta}>
                <td className="px-4 py-3">{venta.id_venta}</td>
                <td className="px-4 py-3">{venta.fecha}</td>
                <td className="px-4 py-3">{venta.cliente || "—"}</td>
                <td className="px-4 py-3 font-medium">{formatearMoneda(venta.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Paginacion pagina={pagina} totalPaginas={datos.total_paginas} total={datos.total} irAPagina={setPagina} />
    </div>
  );
}

const ITEMS_POR_PAGINA = 10;

function ReporteStock() {
  const [buscar, setBuscar] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [datos, setDatos] = useState({ items: [], unidades: 0, valor_inventario: 0 });
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    listarCategoriasProductos({ tamano: 100 }).then((r) => setCategorias(r.items)).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    reporteStock({ buscar, id_categoria_producto: idCategoria })
      .then((r) => setDatos(r))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [buscar, idCategoria]);

  const totalPaginasStock = Math.max(1, Math.ceil(datos.items.length / ITEMS_POR_PAGINA));
  const itemsPagina = datos.items.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar producto</label>
          <input
            type="text"
            value={buscar}
            onChange={(e) => { setBuscar(e.target.value); setPagina(1); }}
            placeholder="Nombre o descripción"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
          <select
            value={idCategoria}
            onChange={(e) => { setIdCategoria(e.target.value); setPagina(1); }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id_categoria_producto} value={c.id_categoria_producto}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">
          Unidades: <b>{datos.unidades}</b>
        </span>
        <span className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1">
          Valor del inventario: <b>{formatearMoneda(datos.valor_inventario)}</b>
        </span>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : datos.items.length === 0 ? (
        <p className="text-gray-500">Sin productos.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Valor total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itemsPagina.map((p) => (
              <tr key={p.id_producto}>
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3">{p.categoria}</td>
                <td className="px-4 py-3">{formatearMoneda(p.precio)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      Number(p.stock) <= 5 ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                  {Number(p.stock) <= 5 && (
                    <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Bajo stock
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{formatearMoneda(p.valor_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginasStock} total={datos.items.length} irAPagina={setPagina} />
    </div>
  );
}

function ReporteClientes() {
  const [buscar, setBuscar] = useState("");
  const [datos, setDatos] = useState({ items: [], total: 0 });
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setCargando(true);
    reporteClientes({ buscar })
      .then((r) => setDatos(r))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [buscar]);

  const totalPaginasClientes = Math.max(1, Math.ceil(datos.items.length / ITEMS_POR_PAGINA));
  const itemsPagina = datos.items.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Buscar cliente</label>
        <input
          type="text"
          value={buscar}
          onChange={(e) => { setBuscar(e.target.value); setPagina(1); }}
          placeholder="Nombre, correo o teléfono"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-72"
        />
      </div>

      <p className="text-sm text-gray-600">
        <b>{datos.total}</b> cliente(s) encontrados
      </p>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : datos.items.length === 0 ? (
        <p className="text-gray-500">Sin clientes.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Citas</th>
              <th className="px-4 py-3">Compras</th>
              <th className="px-4 py-3">Total gastado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itemsPagina.map((cl) => (
              <tr key={cl.id_cliente}>
                <td className="px-4 py-3 font-medium">{cl.nombre}</td>
                <td className="px-4 py-3 text-gray-600">
                  {cl.correo || "—"}
                  {cl.telefono ? ` · ${cl.telefono}` : ""}
                </td>
                <td className="px-4 py-3">{cl.citas}</td>
                <td className="px-4 py-3">{cl.compras}</td>
                <td className="px-4 py-3 font-medium">{formatearMoneda(cl.total_gastado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginasClientes} total={datos.items.length} irAPagina={setPagina} />
    </div>
  );
}

function ReportePromociones() {
  const [activas, setActivas] = useState(false);
  const [datos, setDatos] = useState({ items: [], total: 0 });
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setCargando(true);
    reportePromociones({ activas })
      .then((r) => setDatos(r))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [activas]);

  const totalPaginasPromos = Math.max(1, Math.ceil(datos.items.length / ITEMS_POR_PAGINA));
  const itemsPagina = datos.items.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { setActivas((a) => !a); setPagina(1); }}
          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            activas ? "bg-amber-500 text-white" : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          Solo vigentes
        </button>
        <span className="text-sm text-gray-600">
          <b>{datos.total}</b> promocion(es)
        </span>
      </div>

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : datos.items.length === 0 ? (
        <p className="text-gray-500">Sin promociones.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Descuento</th>
              <th className="px-4 py-3">Vigencia</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itemsPagina.map((pr) => (
              <tr key={pr.id_promocion}>
                <td className="px-4 py-3 font-medium">{pr.titulo}</td>
                <td className="px-4 py-3">{pr.servicio || "—"}</td>
                <td className="px-4 py-3">{pr.descuento}%</td>
                <td className="px-4 py-3 text-gray-600">
                  {pr.fecha_inicio} → {pr.fecha_fin}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      pr.estado === "Vigente"
                        ? "bg-green-100 text-green-700"
                        : pr.estado === "Próxima"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {pr.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginasPromos} total={datos.items.length} irAPagina={setPagina} />
    </div>
  );
}

export default ReportesListados;
