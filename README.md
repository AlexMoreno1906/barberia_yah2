# Frontend de la barbería

Página web para administrar la barbería: barberos, citas, sucursales,
calificaciones, usuarios y roles. Hecha con React + Vite y Tailwind.

## Para correrla

Primero levanta el backend (FastAPI) en el puerto 8001. Después:

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. El proxy de Vite manda lo que empiece por
`/api` al servidor del backend.

## Comandos

- `npm run dev` -> modo desarrollo
- `npm run build` -> build para producción
- `npm run lint` -> revisa el código

## Cómo está organizado

Dentro de `src/`:

- `app/routes/Rutas.jsx` -> todas las rutas de la app en un solo lugar
- `features/` -> cada módulo (barberos, citas, sucursales, calificaciones,
  usuarios, roles, inicio y login)
- `shared/` -> lo que se reutiliza: menú lateral, encabezado, tarjetas,
  el cliente de axios y utilidades
