-- Connexion Google pour vocab-app. À coller dans Supabase > SQL Editor du projet partagé avec manga-reader,
-- APRÈS ta première connexion à vocab-app (ton compte doit exister dans Authentication > Users).
-- Prérequis : la table "vocabulary" a été importée dans ce projet.

alter table vocabulary add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

-- Reprise des mots existants sur le premier (et seul) compte.
update vocabulary set user_id = (select id from auth.users order by created_at limit 1) where user_id is null;

alter table vocabulary enable row level security;
drop policy if exists "vocabulary proprio" on vocabulary;
create policy "vocabulary proprio" on vocabulary for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- L'ancienne table de comptes (mots de passe en clair) n'est plus utilisée : ne pas l'importer dans le projet partagé.
