/* Configuració de l'enviament d'imatges (Supabase Storage).
   Omple'l amb les dades del teu projecte (Settings > API). La clau "anon" és pública per disseny:
   només permet PUJAR imatges amb nom A1/A1_123456.png (vegeu supabase-setup.sql). No hi posis mai la clau "service_role".
   Si la URL o la clau són buides, la pàgina avisa que l'enviament no està configurat. */
window.UPLOAD_CONFIG = {
  url: 'https://brrhryfxkzrxkuqcednw.supabase.co',        // p. ex. 'https://abcdefghijkl.supabase.co'
  anonKey: 'sb_publishable_qKjePlXIGlFLNYHO5UCm3A_dv78-Z9k',    // clau pública (publishable o anon)
  bucket: 'imatges'
};
