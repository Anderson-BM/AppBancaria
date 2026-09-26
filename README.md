# Mis Tarjetas

App personal para llevar el control de tus tarjetas de crédito: límites, fecha de
pago, gastos mes a mes y una tarjeta flotante con tu propia imagen. Hecha con
React + Vite, CSS normal (sin Tailwind) y organizada por módulos.

## Estructura

```
src/
  modules/
    auth/        -> login por PIN (Login.jsx, useAuth.js)
    cards/        -> tarjeta flotante, selector y formulario (imagen HD, límite, fechas)
    expenses/     -> formulario de gastos, tabla y selector de mes
    dashboard/    -> resumen (gastado/disponible), progreso y desglose por categoría
    fixed/        -> página de Gastos Fijos: tabla, límite y gráfica de pastel
  components/      -> piezas compartidas (Modal, EditableName, BottomNav)
  hooks/           -> useTheme (modo claro/oscuro)
  storage/         -> toda la persistencia (hoy en localStorage)
  utils/           -> formato de moneda/fechas, categorías, procesamiento de imagen (image.js)
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
  pasarme"), día de corte y día de pago. Tócala para editarla. Al subir una
  foto, se recorta y reescala automáticamente en HD a la proporción de una
  tarjeta real, para que nunca se vea deformada ni se desborde.
- **Gastos:** se registran por tarjeta y por fecha; el selector de mes te deja
  moverte entre meses anteriores sin perder el historial.
- **Gastos fijos:** en la pestaña "Gastos Fijos" (abajo) llevas tus gastos
  recurrentes (renta, servicios, suscripciones) con su propio límite y una
  gráfica de pastel sencilla por categoría.
- **Tu nombre:** toca el nombre en la parte de arriba para editarlo como
  quieras — se guarda automáticamente.
- **Modo claro/oscuro:** el botón ☀/🌙 alterna el tema y recuerda tu
  preferencia.

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

El proyecto ya incluye un `Dockerfile` que compila la app y la sirve con
nginx, así que en cualquier plataforma que soporte Docker (EasyPanel,
Coolify, Railway, un VPS con Docker, etc.) solo tienes que apuntarla al
repositorio o subir el código — no necesitas compilar nada a mano ni copiar
la carpeta `dist/`.

### En EasyPanel (paso a paso)

1. Sube el proyecto a un repositorio de GitHub (o usa "Upload" en el
   servicio para subir un .zip del proyecto tal cual, con el `Dockerfile`
   incluido en la raíz).
2. En tu proyecto de EasyPanel, crea un nuevo **App Service**.
3. En **Source**, elige GitHub (o Upload) y selecciona el repositorio/carpeta
   donde está el `Dockerfile`.
4. EasyPanel detecta el `Dockerfile` automáticamente y lo usa para compilar
   — no hace falta tocar "Build Command" ni "Nixpacks".
5. En **Domains / Proxy**, configura el puerto a **80** (es el puerto que
   expone nginx dentro del contenedor) y agrega tu dominio.
6. Dale **Deploy**. En unos minutos tu app debe cargar bien.

Si alguna vez ves una pantalla en blanco después de desplegar, revisa en las
herramientas de desarrollador (pestaña Red) qué archivo está pidiendo el
navegador: si pide `main.jsx` directo, significa que el código fuente se
sirvió sin compilar (sin pasar por este Dockerfile) — vuelve a desplegar
asegurándote de que EasyPanel esté usando el `Dockerfile` del proyecto.

### Sin Docker (servidor propio con Nginx/Apache)

Si prefieres no usar Docker, compílala tú mismo y sube solo el resultado:

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` con archivos estáticos. Copia **el contenido**
de `dist/` (no la carpeta completa del proyecto) a la carpeta pública de tu
servidor, por ejemplo `/var/www/mistarjetas`.

- **Si la vas a poner en una subcarpeta** (ej: `tudominio.com/tarjetas/`),
  ya viene configurada como ruta relativa (`base: './'` en
  `vite.config.js`), así que debería funcionar tal cual.
- **Con Vercel/Netlify/GitHub Pages** también funciona: comando de build
  `npm run build`, carpeta de salida `dist`.

## Próximos pasos posibles

- Conectar un backend real para no depender de un solo navegador.
- Notificaciones antes de la fecha de pago.
- Exportar el historial de un mes a Excel/CSV.
