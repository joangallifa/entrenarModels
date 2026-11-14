-- Executa'l una vegada a Supabase: SQL Editor > New query > Run.

-- Cub privat: només PNG, màxim 3 MB per fitxer.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imatges', 'imatges', false, 3145728, array['image/png'])
on conflict (id) do nothing;

-- El públic (clau anon) només pot PUJAR fitxers nous, i només amb el nom exacte  A1/A1_123456.png.
-- No pot llegir, llistar, sobreescriure ni esborrar res.
create policy "pujar caselles"
on storage.objects for insert to anon
with check (
  bucket_id = 'imatges'
  and name ~ '^([A-Z]{1,2}[0-9]{1,3})/\1_[0-9]{6}\.png$'
);

-- ---------------------------------------------------------------------------------------------
-- Descàrrega des de descarregar.html: només un usuari ADMINISTRADOR pot llegir i llistar.
--  1) Authentication > Users > Add user: correu + contrasenya (marca "Auto confirm user").
--  2) Authentication > Sign In / Providers: desactiva "Allow new users to sign up" (important!
--     així ningú més pot crear-se un compte i llegir les imatges).
-- ---------------------------------------------------------------------------------------------
create policy "llegir caselles (administrador)"
on storage.objects for select to authenticated
using (bucket_id = 'imatges');
