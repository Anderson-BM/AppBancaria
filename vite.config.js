import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config simple de Vite. Si despliegas en una subcarpeta de tu server
// (ej: midominio.com/tarjetas/), cambia "base" a esa ruta, ej: '/tarjetas/'
export default defineConfig({
  plugins: [react()],
  base: './',
})
