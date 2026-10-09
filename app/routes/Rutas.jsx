import { Routes, Route } from "react-router-dom";

import LayoutPrincipal from "../../shared/layouts/LayoutPrincipal";
import LayoutBasico from "../../shared/layouts/LayoutBasico";
import LayoutCliente from "../../shared/layouts/LayoutCliente";
import ProtegerRuta from "../../shared/components/ProtegerRuta";
import NoEncontrada from "../../shared/components/NoEncontrada";

import Inicio from "../../features/inicio/Inicio";
import Dashboard from "../../features/dashboard/Dashboard";
import IniciarSesion from "../../features/autenticacion/IniciarSesion";
import Registro from "../../features/autenticacion/Registro";

import ClienteInicio from "../../features/cliente/ClienteInicio";
import CatalogoServicios from "../../features/cliente/CatalogoServicios";
import TurnoCliente from "../../features/cliente/TurnoCliente";

import Barberos from "../../features/barberos/Barberos";
import BarberoFormulario from "../../features/barberos/BarberoFormulario";

import Citas from "../../features/citas/Citas";
import CitaFormulario from "../../features/citas/CitaFormulario";
import FinalizarCita from "../../features/citas/FinalizarCita";

import Sucursales from "../../features/sucursales/Sucursales";
import SucursalFormulario from "../../features/sucursales/SucursalFormulario";

import Calificaciones from "../../features/calificaciones/Calificaciones";
import CalificacionFormulario from "../../features/calificaciones/CalificacionFormulario";

import Usuarios from "../../features/usuarios/Usuarios";
import UsuarioFormulario from "../../features/usuarios/UsuarioFormulario";

import Roles from "../../features/roles/Roles";
import RolFormulario from "../../features/roles/RolFormulario";

import Clientes from "../../features/clientes/Clientes";
import ClienteFormulario from "../../features/clientes/ClienteFormulario";

import Servicios from "../../features/servicios/Servicios";
import ServicioFormulario from "../../features/servicios/ServicioFormulario";

import Productos from "../../features/productos/Productos";
import ProductoFormulario from "../../features/productos/ProductoFormulario";

import Promociones from "../../features/promociones/Promociones";
import PromocionFormulario from "../../features/promociones/PromocionFormulario";

import MetodosPago from "../../features/metodosPago/MetodosPago";
import MetodoPagoFormulario from "../../features/metodosPago/MetodoPagoFormulario";

import CategoriasServicios from "../../features/categoriasServicios/CategoriasServicios";
import CategoriaServicioFormulario from "../../features/categoriasServicios/CategoriaServicioFormulario";

import CategoriasProductos from "../../features/categoriasProductos/CategoriasProductos";
import CategoriaProductoFormulario from "../../features/categoriasProductos/CategoriaProductoFormulario";

import Ventas from "../../features/ventas/Ventas";
import VentaFormulario from "../../features/ventas/VentaFormulario";

import RegistrarPago from "../../features/pagos/RegistrarPago";

import ReportesListados from "../../features/reportes/ReportesListados";
import ReportesEstadisticos from "../../features/reportes/ReportesEstadisticos";

function Rutas() {
  return (
    <Routes>
      {/* login y registro van centrados, sin menú */}
      <Route element={<LayoutBasico />}>
        <Route path="/login" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* rutas protegidas del portal de clientes */}
      <Route element={<ProtegerRuta roles={["Cliente"]} />}>
        <Route element={<LayoutCliente />}>
          <Route path="/cliente" element={<ClienteInicio />} />
          <Route path="/cliente/servicios" element={<CatalogoServicios />} />
          <Route path="/cliente/turno" element={<TurnoCliente />} />
        </Route>
      </Route>

      {/* rutas protegidas con menú lateral */}
      <Route element={<ProtegerRuta roles={["Administrador", "Barbero"]} />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/citas" element={<Citas />} />
          <Route path="/citas/nueva" element={<CitaFormulario />} />
          <Route path="/citas/:id/editar" element={<CitaFormulario />} />
          <Route path="/citas/finalizar" element={<FinalizarCita />} />

          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/sucursales/nueva" element={<SucursalFormulario />} />
          <Route path="/sucursales/:id/editar" element={<SucursalFormulario />} />

          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/calificaciones/nueva" element={<CalificacionFormulario />} />
          <Route path="/calificaciones/:id/editar" element={<CalificacionFormulario />} />

          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<ClienteFormulario />} />
          <Route path="/clientes/:id/editar" element={<ClienteFormulario />} />

          <Route path="/reportes/listados" element={<ReportesListados />} />
          <Route path="/reportes/estadisticos" element={<ReportesEstadisticos />} />

          {/* módulos exclusivos de administración */}
          <Route element={<ProtegerRuta roles={["Administrador"]} />}>
            <Route path="/barberos" element={<Barberos />} />
            <Route path="/barberos/nuevo" element={<BarberoFormulario />} />
            <Route path="/barberos/:id/editar" element={<BarberoFormulario />} />

            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/nuevo" element={<UsuarioFormulario />} />
            <Route path="/usuarios/:id/editar" element={<UsuarioFormulario />} />

            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/nuevo" element={<RolFormulario />} />
            <Route path="/roles/:id/editar" element={<RolFormulario />} />

            <Route path="/servicios" element={<Servicios />} />
            <Route path="/servicios/nuevo" element={<ServicioFormulario />} />
            <Route path="/servicios/:id/editar" element={<ServicioFormulario />} />

            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/nuevo" element={<ProductoFormulario />} />
            <Route path="/productos/:id/editar" element={<ProductoFormulario />} />

            <Route path="/promociones" element={<Promociones />} />
            <Route path="/promociones/nueva" element={<PromocionFormulario />} />
            <Route path="/promociones/:id/editar" element={<PromocionFormulario />} />

            <Route path="/metodos-pago" element={<MetodosPago />} />
            <Route path="/metodos-pago/nuevo" element={<MetodoPagoFormulario />} />
            <Route path="/metodos-pago/:id/editar" element={<MetodoPagoFormulario />} />

            <Route path="/categorias-servicios" element={<CategoriasServicios />} />
            <Route path="/categorias-servicios/nueva" element={<CategoriaServicioFormulario />} />
            <Route path="/categorias-servicios/:id/editar" element={<CategoriaServicioFormulario />} />

            <Route path="/categorias-productos" element={<CategoriasProductos />} />
            <Route path="/categorias-productos/nueva" element={<CategoriaProductoFormulario />} />
            <Route path="/categorias-productos/:id/editar" element={<CategoriaProductoFormulario />} />

            <Route path="/ventas" element={<Ventas />} />
            <Route path="/ventas/nueva" element={<VentaFormulario />} />

            <Route path="/pagos/registrar" element={<RegistrarPago />} />
          </Route>
        </Route>
      </Route>

      {/* cualquier otra dirección cae en el 404 */}
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}

export default Rutas;
