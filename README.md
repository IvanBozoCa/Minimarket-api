# Minimarket POS API (TypeScript + Express + Supabase)

API REST para gestionar las operaciones básicas de un minimarket: registro de productos, registro de ventas y actualización automática de stock.  
El objetivo de este proyecto es servir como base para un futuro **sistema de punto de venta (POS)** y una app móvil que permita leer códigos de barras con la cámara del celular.

Este proyecto forma parte de mi ruta de aprendizaje para migrar desde **Python/FastAPI** a **Node.js + TypeScript**, utilizando buenas prácticas de backend y una base de datos gestionada en la nube (**Supabase/PostgreSQL**).

---

## Características principales

- Registro y consulta de **productos**:
  - Código interno (`code`)
  - Código de barras (`barcode`)
  - Nombre (`name`)
  - Precio (`price`)
  - Stock disponible (`stock`)
- Registro de **ventas**:
  - Cada venta contiene uno o más ítems con:
    - `productCode`, `name`, `unitPrice`, `quantity`, `subtotal`
  - Cálculo automático del **total de la venta**.
  - Registro de ventas e ítems en tablas separadas (`sales`, `sale_items`).
- **Actualización automática de stock**:
  - En cada venta se descuenta el stock de los productos involucrados.
  - Validaciones de cantidad y stock disponible.
- API pensada para integrarse con:
  - Una futura app móvil de escaneo de códigos de barras.
  - Un frontend web simple (por ejemplo, React) para uso de cajero/administrador.

---

## Stack tecnológico

- **Lenguaje**: TypeScript
- **Runtime**: Node.js (recomendado Node 18+)
- **Framework web**: Express
- **Base de datos**: PostgreSQL gestionado mediante **Supabase**
- **Cliente de BD**: [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript)
- **Herramientas de desarrollo**:
  - `ts-node-dev` para desarrollo en caliente
  - `npm` como gestor de paquetes

---

## Arquitectura del proyecto

Estructura principal del código:

```txt
src/
  server.ts             # Arranque del servidor Express y configuración de rutas
  supabaseClient.ts     # Cliente de Supabase inicializado con variables de entorno

  types/
    product.ts          # Tipos/Interfaces para productos
    sale.ts             # Tipos/Interfaces para ventas y sus ítems

  data/
    products.ts         # Lógica de acceso a datos de productos (Supabase)
    sales.ts            # Lógica de acceso a datos de ventas (Supabase)

  routes/
    products.routes.ts  # Rutas HTTP para /products
    sales.routes.ts     # Rutas HTTP para /sales
```
## Próximos pasos / Roadmap

Este proyecto está pensado como base para mejoras futuras:

  Autenticación con JWT (roles: cajero, administrador).

  Integración con lector de código de barras (ej. app móvil que consuma esta API).

  Implementar transacciones a nivel de base de datos para garantizar consistencia en ventas y stock.

  Migrar la lógica a NestJS con módulos products y sales separados.

  Agregar tests unitarios (Jest) para la lógica de negocio crítica.

  Crear un frontend simple (React) que consuma esta API y simule una caja de minimarket.
  
## Autor

Desarrollado por Iván Bozo Catalán
Estudiante de último semestre de Ingeniería Civil en Computación, con experiencia previa en backend con Python/FastAPI y despliegues en Render/Vercel, actualmente ampliando su stack hacia Node.js, TypeScript y NestJS.
