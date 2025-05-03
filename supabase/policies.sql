-- Supabase RLS policies for Jump to Recipe

-- Recipes
alter table recipes enable row level security;
create policy "insert own recipe" on recipes for insert with check (auth.uid() = author_id);
create policy "read approved" on recipes for select using (is_approved = true);
create policy "moderator update/delete" on recipes for update, delete using (auth.uid() = 'your-moderator-user-id');

-- Comments
alter table recipe_comments enable row level security;
create policy "user comment access" on recipe_comments for all using (auth.uid() = user_id);

-- Cookbook
alter table cookbook_recipes enable row level security;
create policy "user cookbook access" on cookbook_recipes for all using (auth.uid() = user_id);
