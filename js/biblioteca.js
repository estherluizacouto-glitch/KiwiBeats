import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const musicList = document.getElementById("music-list");

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  
  // 🔥 Buscar músicas do Supabase
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

      // 🎵 CLICAR NA MÚSICA = TOCAR
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-container')) {
          window.setPlayerSong(song);
        }
      });

      musicList.appendChild(item);
    });

    lucide.createIcons();
  }


  // 🗑 Deletar música
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;

    const id = btn.dataset.id;

    if (confirm('Deseja realmente deletar esta música?')) {
      await supabase.from('songs').delete().eq('id', id);
      location.reload();
    }
  });
});
