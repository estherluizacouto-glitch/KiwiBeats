import supabase from './supabaseClient.js'

document.addEventListener("DOMContentLoaded", async () => {

  const loading = document.getElementById("loading");
  const content = document.getElementById("content");
  const noSession = document.getElementById("no-session");

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    loading.classList.add("hidden");
    noSession.classList.remove("hidden");
    return;
  }

  const user = session.user;

  document.getElementById("display-name").textContent =
    user.user_metadata?.full_name || user.email;

  const avatar = user.user_metadata?.avatar_url;
  const avatarRing = document.getElementById("avatar-ring");

  if (avatar) {
    avatarRing.innerHTML = `
      <img src="${avatar}">
      <div class="avatar-glow-overlay"></div>
    `;
  }

  loading.classList.add("hidden");
  content.classList.remove("hidden");
});
