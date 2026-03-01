export function initSidebar(supabase) {

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const toggleIcon = document.getElementById('toggleIcon');
  const logoutBtn = document.getElementById('logoutBtn');

  console.log('sidebar:', sidebar);
  console.log('toggleBtn:', toggleBtn);
  
  if (!sidebar) return;

  // Toggle
  if (toggleBtn && toggleIcon) {
    toggleBtn.onclick = () => { // Usar onclick garante que não acumularemos listeners
      const isCollapsed = sidebar.classList.toggle('collapsed');
      toggleIcon.setAttribute("data-lucide", isCollapsed ? "chevron-right" : "chevron-left");
      if (window.lucide) lucide.createIcons();
    };
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/KiwiBeats';
    };
  }
}

export async function updateSidebarUI(user, supabase) {
  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userName');
  const creditsElement = document.getElementById('credits');

  if (!avatar || !name) return;

  if (user) {
    name.textContent = user.user_metadata?.full_name || 'Usuário';
    avatar.src = user.user_metadata?.avatar_url || 'assets/images/default-avatar.png';

    const { data } = await supabase
      .from('credits')
      .select('credits_remaining')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data && creditsElement) {
      creditsElement.textContent = `${data.credits_remaining} créditos`;
    }

  } else {
    name.textContent = 'Visitante';
    avatar.src = 'assets/images/default-avatar.png';
    if (creditsElement) creditsElement.textContent = '';
  }
}
