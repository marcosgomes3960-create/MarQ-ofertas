-- MarQ Ofertas | Fotos dos produtos
-- Execute uma única vez no SQL Editor do Supabase (projeto zonclgsfqtylnedxigxd).
alter table public.produtos add column if not exists image_url text;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('produtos','produtos',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "MarQ fotos publicas leitura" on storage.objects;
create policy "MarQ fotos publicas leitura" on storage.objects for select to anon, authenticated using (bucket_id='produtos');
drop policy if exists "MarQ admin envia fotos" on storage.objects;
create policy "MarQ admin envia fotos" on storage.objects for insert to authenticated with check (bucket_id='produtos' and auth.uid()='89fdb1b1-c59d-4928-8b7d-8e604046d456'::uuid);
drop policy if exists "MarQ admin atualiza fotos" on storage.objects;
create policy "MarQ admin atualiza fotos" on storage.objects for update to authenticated using (bucket_id='produtos' and auth.uid()='89fdb1b1-c59d-4928-8b7d-8e604046d456'::uuid) with check (bucket_id='produtos' and auth.uid()='89fdb1b1-c59d-4928-8b7d-8e604046d456'::uuid);
drop policy if exists "MarQ admin remove fotos" on storage.objects;
create policy "MarQ admin remove fotos" on storage.objects for delete to authenticated using (bucket_id='produtos' and auth.uid()='89fdb1b1-c59d-4928-8b7d-8e604046d456'::uuid);
grant select on public.produtos to anon,authenticated;
