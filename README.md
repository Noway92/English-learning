# vocab-app

Application de révision de vocabulaire anglais (Vite + React + Supabase).

## Connexion
Google via Supabase Auth, sur le **même projet Supabase que manga-reader** (mêmes comptes).
La table `vocabulary` a une colonne `user_id` et une RLS `auth.uid() = user_id` : chacun ne voit que ses mots.

## Mise en place
1. Importer la table `vocabulary` dans le projet Supabase de manga-reader (ne pas importer `tableuser`, abandonnée).
2. Se connecter une première fois à vocab-app avec Google, puis coller `supabase/migration-auth.sql` dans le SQL Editor.
3. Supabase → Authentication → URL Configuration → Redirect URLs : ajouter l'URL de vocab-app (prod, `http://localhost:5173/**`, previews Vercel).
4. `.env` (et Vercel) : `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` du projet partagé, et `VITE_EMAILS_AUTORISES`
   (adresses Gmail autorisées, séparées par des virgules, comme `EMAILS_AUTORISES` de manga-reader).
   Liste vide = personne ne peut entrer. Le contrôle se fait dans le navigateur (compte refusé = déconnexion immédiate) ;
   la protection réelle des données reste la RLS par `user_id`.

## Commandes
`npm run dev`, `npm run build`, `npm run lint`.
