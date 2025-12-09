# Minimarket POS API (TypeScript + Express + Supabase)

## Descripción

[Escribe en 3–5 líneas qué hace la API:
- Registrar productos de un minimarket
- Registrar ventas
- Actualizar stock automáticamente
- Pensado como base para futura app móvil de escáner/barcode]

## Stack Tecnológico

- Node.js + TypeScript
- Express
- Supabase (PostgreSQL gestionado)
- @supabase/supabase-js

## Arquitectura (alto nivel)

- `src/server.ts`: arranque del servidor Express.
- `src/supabaseClient.ts`: cliente de Supabase.
- `src/types/`: tipos compartidos (Product, Sale, etc.).
- `src/data/`: lógica de acceso a datos (products, sales).
- `src/routes/`: rutas HTTP (`/products`, `/sales`).

## Requisitos

- Node.js >= 18
- Cuenta en Supabase (o usar las mismas tablas que se describen abajo)

## Configuración de entorno

Crear un archivo `.env` en la raíz:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3000
