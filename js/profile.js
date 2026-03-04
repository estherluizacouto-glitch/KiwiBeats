import supabase from './supabaseClient.js'

document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("content");
  const noSession = document.getElementById("no-session");

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    noSession.classList.remove("hidden");
    return;
  }

  const user = session.user;

  // Nome
  document.getElementById("display-name").textContent =
    user.user_metadata?.full_name || user.email;

  // Avatar
  const avatar = user.user_metadata?.avatar_url;
  const avatarRing = document.getElementById("avatar-ring");
  if (avatar) {
    avatarRing.innerHTML = `
      <img src="${avatar}" alt="avatar">
      <div class="avatar-glow-overlay"></div>
    `;
  } else {
    const initial = (user.user_metadata?.full_name || user.email || "?")[0].toUpperCase();
    avatarRing.innerHTML = `<div class="avatar-placeholder">${initial}</div>`;
  }

  // Créditos
  const { data: creditsData } = await supabase
    .from('credits')
    .select('credits_remaining')
    .eq('user_id', user.id)
    .maybeSingle();

  if (creditsData) {
    document.getElementById("stat-creditos").textContent = creditsData.credits_remaining;
  }

  content.classList.remove("hidden");

  if (window.lucide) lucide.createIcons();

  // Sair
  document.getElementById("sign-out-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/KiwiBeats';
  });
});
