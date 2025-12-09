-- Crea la tabla products en el schema público
create table if not exists public.products (
  id        bigserial primary key,
  code      text not null unique,
  barcode   text not null unique,
  name      text not null,
  price     integer not null check (price > 0),
  stock     integer not null check (stock >= 0),
  created_at timestamptz not null default now()
);
