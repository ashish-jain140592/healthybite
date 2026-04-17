-- ──────────────────────────────────────────────────────────────
-- HealthyBite — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ──────────────────────────────────────────────────────────────

-- Extensions
create extension if not exists "uuid-ossp";

-- ── ENUMS ─────────────────────────────────────────────────────
create type plan_type as enum ('single', 'weekly', 'monthly');
create type order_status as enum ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled');
create type delivery_slot as enum ('morning', 'afternoon', 'evening');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

-- ── PROFILES ──────────────────────────────────────────────────
-- Extends auth.users (created automatically on signup)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── ADDRESSES ─────────────────────────────────────────────────
create table addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  label       text not null default 'Home',   -- Home / Work / Other
  line1       text not null,
  line2       text,
  city        text not null,
  pincode     text not null,
  is_default  boolean not null default false,
  created_at  timestamptz default now()
);

alter table addresses enable row level security;
create policy "Users manage own addresses" on addresses
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── PRODUCTS ──────────────────────────────────────────────────
create table products (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  description  text,
  image_url    text,
  base_price   numeric(10,2) not null,   -- single-day price
  is_available boolean not null default true,
  created_at   timestamptz default now()
);

-- Products are public
alter table products enable row level security;
create policy "Anyone can read products" on products for select using (true);
create policy "Admins can manage products" on products
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ── ORDERS ────────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete restrict,
  address_id       uuid not null references addresses(id) on delete restrict,
  plan             plan_type not null,
  delivery_slot    delivery_slot not null,
  subtotal         numeric(10,2) not null,
  total_amount     numeric(10,2) not null,
  status           order_status not null default 'pending',
  payment_status   payment_status not null default 'pending',
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  delivery_date    date not null,
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table orders enable row level security;
create policy "Users read own orders"   on orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins manage all orders" on orders
  using (auth.jwt() ->> 'role' = 'admin');

-- ── ORDER ITEMS ───────────────────────────────────────────────
create table order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id) on delete restrict,
  quantity    int not null default 1,
  unit_price  numeric(10,2) not null,
  line_total  numeric(10,2) generated always as (quantity * unit_price) stored
);

alter table order_items enable row level security;
create policy "Users read own order items" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────
-- Tracks active weekly/monthly passes
create table subscriptions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  plan         plan_type not null check (plan in ('weekly', 'monthly')),
  start_date   date not null,
  end_date     date not null,
  is_active    boolean not null default true,
  order_id     uuid references orders(id) on delete set null,
  created_at   timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "Users read own subscriptions" on subscriptions for select using (auth.uid() = user_id);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- ── PRICE HELPER ──────────────────────────────────────────────
-- Returns the price multiplier for a plan type
create or replace function plan_multiplier(p plan_type)
returns numeric language sql immutable as $$
  select case p
    when 'single'  then 1
    when 'weekly'  then 6      -- 7 days, 1 free
    when 'monthly' then 22     -- 30 days, 8 free
  end;
$$;
