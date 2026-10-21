alter table public.daily_menu_items
  add column if not exists name_en text,
  add column if not exists name_kn text,
  add column if not exists category_en text,
  add column if not exists category_kn text;

update public.daily_menu_items
set
  name_en = coalesce(name_en, name),
  category_en = coalesce(category_en, category)
where name_en is null or category_en is null;
