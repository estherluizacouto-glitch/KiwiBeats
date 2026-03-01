import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const musicList = document.getElementById("music-list");

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // 🔥 Buscar músicas
  const { data: songs, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar músicas:", error);
    return;
  }

  if (musicList && songs) {
    songs.forEach(song => {

      const item = document.createElement("div");
      item.classList.add("music-item");

      item.innerHTML = `
        <div class="music-left">
          <img src="${song.cover_url}" class="music-cover">
          <div class="music-info">
            <div class="music-name">${song.title}</div>
            <div class="music-meta">
              ${formatTime(song.duration)} • ${song.style}
            </div>
          </div>
        </div>

        <div class="menu-container">
          <button class="menu-btn">
            <i data-lucide="more-vertical"></i>
          </button>
          <div class="dropdown">
            <button class="delete-btn" data-id="${song.id}">
              <i data-lucide="trash-2"></i> Deletar
            </button>
          </div>
        </div>
      `;

      // 🎵 Clique na música
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-container')) {
          console.log("Clicou na música:", song);
          window.setPlayerSong(song);
        }
      });

      const menuBtn = item.querySelector('.menu-btn');
      const dropdown = item.querySelector('.dropdown');
      
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Fecha todos os outros dropdowns abertos
        document.querySelectorAll('.dropdown.active').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });

      musicList.appendChild(item);
    });

    lucide.createIcons();
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
  });

  // 🗑 Deletar
  let pendingDeleteId = null;
  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmDelete = document.getElementById("confirmDelete");
  const confirmCancel = document.getElementById("confirmCancel");
  
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;
    e.stopPropagation();
    pendingDeleteId = btn.dataset.id;
    confirmOverlay.classList.remove('hidden');
    lucide.createIcons();
  });
  
  confirmCancel.addEventListener('click', () => {
    confirmOverlay.classList.add('hidden');
    pendingDeleteId = null;
  });
  
  confirmDelete.addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    await supabase.from('songs').delete().eq('id', pendingDeleteId);
    confirmOverlay.classList.add('hidden');
    pendingDeleteId = null;
    location.reload();
  });
  
  // Fecha ao clicar fora da caixa
  confirmOverlay.addEventListener('click', (e) => {
    if (e.target === confirmOverlay) {
      confirmOverlay.classList.add('hidden');
      pendingDeleteId = null;
    }
  });

});
