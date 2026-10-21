create table if not exists public.owner_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_date date not null,
  name text not null check (char_length(name) between 1 and 120),
  category text,
  price numeric(10,2) check (price is null or price >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.owner_profiles enable row level security;
alter table public.daily_menu_items enable row level security;

-- Explicit Data API grants required for tables created after 30 October 2026.
grant select on public.daily_menu_items to anon;
grant select, insert, update, delete on public.daily_menu_items to authenticated;
grant select, insert, update, delete on public.daily_menu_items to service_role;
grant select, insert, update, delete on public.owner_profiles to authenticated, service_role;

create policy "Public can read available menu items" on public.daily_menu_items for select to anon, authenticated using (is_available = true);
create policy "Owners manage menu items" on public.daily_menu_items for all to authenticated using (exists (select 1 from public.owner_profiles where id = auth.uid())) with check (exists (select 1 from public.owner_profiles where id = auth.uid()));
create policy "Owners read own profile" on public.owner_profiles for select to authenticated using (id = auth.uid());

insert into storage.buckets (id, name, public) values ('daily-menu-images', 'daily-menu-images', true) on conflict (id) do update set public = true;
create policy "Public can read daily menu images" on storage.objects for select to anon, authenticated using (bucket_id = 'daily-menu-images');
create policy "Owners upload daily menu images" on storage.objects for insert to authenticated with check (bucket_id = 'daily-menu-images' and exists (select 1 from public.owner_profiles where id = auth.uid()));
create policy "Owners update daily menu images" on storage.objects for update to authenticated using (bucket_id = 'daily-menu-images' and exists (select 1 from public.owner_profiles where id = auth.uid()));
create policy "Owners delete daily menu images" on storage.objects for delete to authenticated using (bucket_id = 'daily-menu-images' and exists (select 1 from public.owner_profiles where id = auth.uid()));

-- After creating the owner user in Supabase Auth, run once (replace the email):
-- insert into public.owner_profiles (id) select id from auth.users where email = 'owner@example.com';
