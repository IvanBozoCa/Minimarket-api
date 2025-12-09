-- Tabla de ventas
create table if not exists public.sales (
  id         bigserial primary key,
  created_at timestamptz not null default now(),
  total      integer not null check (total >= 0)
);

-- Tabla de ítems de venta
create table if not exists public.sale_items (
  id           bigserial primary key,
  sale_id      bigint not null references public.sales(id) on delete cascade,
  product_code text not null references public.products(code),
  name         text not null,
  unit_price   integer not null check (unit_price > 0),
  quantity     integer not null check (quantity > 0),
  subtotal     integer not null check (subtotal >= 0)
);
