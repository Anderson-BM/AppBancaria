# Mis Tarjetas

App personal para llevar el control de tus tarjetas de crédito: límites, fecha de
pago, gastos mes a mes y una tarjeta flotante con tu propia imagen. Hecha con
React + Vite, CSS normal (sin Tailwind) y organizada por módulos.

## Estructura

```
src/
  modules/
    auth/        -> login por PIN (Login.jsx, useAuth.js)
    cards/        -> tarjeta flotante, selector y formulario (imagen, límite, fechas)
    expenses/     -> formulario de gastos, tabla y selector de mes
    dashboard/    -> resumen (gastado/disponible), progreso y desglose por categoría
  components/      -> piezas compartidas (Modal)
  storage/         -> toda la persistencia (hoy en localStorage)
  utils/           -> formato de moneda, fechas, helpers
```

Cada carpeta de `modules` trae su propio `.css`. Si mañana quieres cambiar a un
backend real, solo tocas `src/storage/storage.js`: el resto de la app no sabe
de dónde vienen los datos.

## Cómo funciona

- **Login:** la primera vez que abres la app te pide crear un PIN; de ahí en
  adelante, te lo pide para entrar. Es una barrera simple pensada para que
  nadie mas la abra desde tu celular o navegador — no es un login de servidor
  con usuarios, así que si la subes a un dominio público cualquiera podría
  intentar adivinar el PIN. Si quieres algo más seguro (usuario/contraseña con
  backend), lo conversamos y lo conectamos después.
- **Datos:** todo se guarda en el `localStorage` del navegador donde la uses.
  Eso significa que si entras desde el celular y desde la computadora, cada
  uno tiene su propia copia. Usa el botón ⬇ (arriba a la derecha) para
  descargar un respaldo en JSON cuando quieras.
- **Tarjetas:** puedes agregar varias, cada una con su imagen, límite ("no
  pasarme"), día de corte y día de pago. Tócala para editarla.
- **Gastos:** se registran por tarjeta y por fecha; el selector de mes te deja
  moverte entre meses anteriores sin perder el historial.

## Requisitos

- Node.js 18 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).
Para probarla desde el celular en tu misma red, usa:

```bash
npm run dev -- --host
```

y entra desde el celular a la IP de tu computadora que aparezca en la terminal.

## Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con archivos estáticos (HTML, CSS, JS) listos
para subir a cualquier servidor.

## Desplegar en tu server

Como es una SPA 100% estática, solo necesitas servir la carpeta `dist/`:

- **Con Nginx/Apache:** copia el contenido de `dist/` a la carpeta pública del
  sitio (ej: `/var/www/mistarjetas`) y apunta el server block ahí.
- **Si la vas a poner en una subcarpeta** (ej: `tudominio.com/tarjetas/`),
  antes de compilar cambia en `vite.config.js` la línea `base: './'` — ya
  viene configurada como ruta relativa así que debería funcionar tal cual en
  subcarpetas también.
- **Con Vercel/Netlify/GitHub Pages** también funciona: comando de build
  `npm run build`, carpeta de salida `dist`.

No hay backend ni base de datos que instalar; es solo servir archivos estáticos.

## Próximos pasos posibles

- Conectar un backend real para no depender de un solo navegador.
- Notificaciones antes de la fecha de pago.
- Exportar el historial de un mes a Excel/CSV.
