insert into public.categories (name, slug, description)
values ('Desk Models', 'desk-models', 'Decorative and functional desk-sized prints.')
on conflict (slug) do nothing;

insert into public.products (
  category_id,
  name,
  slug,
  description,
  base_price,
  allow_quantity,
  allow_size,
  allow_material,
  allow_color_design,
  allow_other_notes
)
select
  c.id,
  'Hex Pencil Holder',
  'hex-pencil-holder',
  'A geometric organizer for pens and tools.',
  12.50,
  true,
  true,
  true,
  true,
  true
from public.categories c
where c.slug = 'desk-models'
on conflict (slug) do nothing;

insert into public.product_options (product_id, option_type, label, sort_order)
select p.id, 'size', option_value, sort_order
from public.products p
cross join (values ('Small', 0), ('Medium', 1), ('Large', 2)) as v(option_value, sort_order)
where p.slug = 'hex-pencil-holder'
on conflict do nothing;

insert into public.product_options (product_id, option_type, label, sort_order)
select p.id, 'material', option_value, sort_order
from public.products p
cross join (values ('PLA', 0), ('PETG', 1)) as v(option_value, sort_order)
where p.slug = 'hex-pencil-holder'
on conflict do nothing;

insert into public.product_options (product_id, option_type, label, sort_order)
select p.id, 'color_design', option_value, sort_order
from public.products p
cross join (values ('Black', 0), ('White', 1), ('Orange', 2)) as v(option_value, sort_order)
where p.slug = 'hex-pencil-holder'
on conflict do nothing;
