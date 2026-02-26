const SUPABASE_URL      = "https://gevwfciirevgbrzklrpp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldndmY2lpcmV2Z2JyemtscnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTg0NTgsImV4cCI6MjA4NjIzNDQ1OH0.auWkhHSUy9mzk-2U0AYExgzf90MQbZ6PPd98VhJMN4w";

const { createClient } = supabase; // global do CDN
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Elementos do DOM ── */
const elLoading     = document.getElementById("loading");
const elNoSession   = document.getElementById("no-session");
const elContent     = document.getElementById("content");
const elDisplayName = document.getElementById("display-name");
const elAvatarRing  = document.getElementById("avatar-ring");
const elSeguindo    = document.getElementById("stat-seguindo");
const elSeguidores  = document.getElementById("stat-seguidores");
const elSignOutBtn  = document.getElementById("sign-out-btn");

/* ── Helpers ── */

/**
 * Alterna a visibilidade dos painéis de estado.
 * @param {"loading"|"no-session"|"content"} state
 */
function showState(state) {
  elLoading.classList.add("hidden");
  elNoSession.classList.add("hidden");
  elContent.classList.add("hidden");

  if (state === "loading")    elLoading.classList.remove("hidden");
  if (state === "no-session") elNoSession.classList.remove("hidden");
  if (state === "content")    elContent.classList.remove("hidden");
}

/**
 * Renderiza o avatar dentro de #avatar-ring.
 * Se houver URL usa <img>, senão mostra a inicial com fundo kiwi.
 * @param {string|null} url
 * @param {string} name
 */
function renderAvatar(url, name) {
  elAvatarRing.innerHTML = "";

  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Foto de perfil";
    elAvatarRing.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "avatar-placeholder";
    placeholder.textContent = (name?.[0] ?? "U").toUpperCase();
    elAvatarRing.appendChild(placeholder);
  }

  // Overlay de brilho interno
  const glow = document.createElement("div");
  glow.className = "avatar-glow-overlay";
  elAvatarRing.appendChild(glow);
}

/**
 * Resolve o nome a exibir com vários fallbacks.
 * @param {object} profile  linha da tabela profiles
 * @param {object} user     objeto da sessão Supabase
 * @returns {string}
 */
function resolveDisplayName(profile, user) {
  return (
    profile?.nome                       ||
    profile?.full_name                  ||
    user?.user_metadata?.full_name      ||
    user?.user_metadata?.name           ||
    user?.email?.split("@")[0]          ||
    "Usuário"
  );
}

/* ── Inicialização ── */

async function init() {
  showState("loading");

  // 1. Verifica sessão ativa
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    showState("no-session");
    return;
  }

  const user = session.user;

  // 2. Busca perfil na tabela 'profiles'
  //    Ajuste os campos conforme a sua estrutura de banco
  const { data: profile } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Resolve URL do avatar
  let avatarUrl = null;

  if (profile?.avatar_url) {
    // Avatar salvo no Supabase Storage (bucket "avatars")
    const { data } = db.storage
      .from("avatars")
      .getPublicUrl(profile.avatar_url);
    avatarUrl = data?.publicUrl ?? null;
  } else if (user.user_metadata?.avatar_url) {
    // Avatar vindo de login OAuth (Google, GitHub, etc.)
    avatarUrl = user.user_metadata.avatar_url;
  }

  // 4. Preenche a interface
  const displayName = resolveDisplayName(profile, user);

  elDisplayName.textContent        = displayName;
  elSeguindo.textContent           = profile?.seguindo   ?? 0;
  elSeguidores.textContent         = profile?.seguidores ?? 0;

  renderAvatar(avatarUrl, displayName);

  showState("content");
}

/* ── Evento: sair ── */

elSignOutBtn.addEventListener("click", async () => {
  elSignOutBtn.disabled = true;
  elSignOutBtn.textContent = "Saindo...";

  await db.auth.signOut();
  window.location.reload();
});

/* ── Inicia ── */
init();
