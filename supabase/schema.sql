-- Supabase schema for Jump to Recipe
create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ingredients text,
  steps text,
  cook_time text,
  servings integer,
  tags text[],
  image_url text,
  author_id uuid references auth.users(id),
  is_approved boolean default false,
  view_count integer default 0,
  inserted_at timestamp default now()
);

create table recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id),
  user_id uuid references auth.users(id),
  author_name text,
  comment text,
  rating int check (rating between 1 and 5),
  created_at timestamp default now()
);

create table cookbook_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  recipe_id uuid references recipes(id),
  created_at timestamp default now(),
  unique (user_id, recipe_id)
);
