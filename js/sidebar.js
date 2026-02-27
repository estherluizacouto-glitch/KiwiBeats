export function initSidebar(supabase) {

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const toggleIcon = document.getElementById('toggleIcon');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!sidebar) return;

  // Toggle
  if (toggleBtn && toggleIcon) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');

      toggleIcon.setAttribute(
        "data-lucide",
        isCollapsed ? "chevron-left" : "chevron-right"
      );

      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/KiwiBeats';
    });
  }

  loadUserData(supabase);
}

async function loadUserData(supabase) {

  const { data: { user } } = await supabase.auth.getUser();

  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  const creditsElement = document.getElementById('credits');

  if (!avatar || !name) return;

  if (user) {
    name.textContent = user.user_metadata?.full_name || '';
    avatar.src = user.user_metadata?.avatar_url || 'assets/images/default-avatar.png';

    const { data } = await supabase
      .from('credits')
      .select('credits_remaining')
      .eq('user_id', user.id)
      .single();

    if (data && creditsElement) {
      creditsElement.textContent = `${data.credits_remaining} créditos`;
    }

  } else {
    name.textContent = '';
    avatar.src = 'assets/images/default-avatar.png';
    if (creditsElement) creditsElement.textContent = '';
  }
}
