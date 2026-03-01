import supabase from './supabaseClient.js'

function initLyricsSidebar() {
  const sidebar = document.getElementById('sidebar-lyrics');
  const overlay = document.getElementById('sidebar-lyrics-overlay');
  const closeBtn = document.getElementById('sidebar-lyrics-close');

  function closeLyricsSidebar() {
    sidebar.classList.add('closed');
    overlay.classList.add('closed');
  }

  window.openLyricsSidebar = function(song) {
    // Preenche os dados
    document.getElementById('sidebar-lyrics-cover').src = song.cover_url || '';
    document.getElementById('sidebar-lyrics-title').innerText = song.title || '—';
    document.getElementById('sidebar-lyrics-genre').innerText = song.style || '—';

    // Letra
    const scroll = document.getElementById('sidebar-lyrics-scroll');
    if (song.lyrics) {
      const lines = song.lyrics.split('\n');
      scroll.innerHTML = lines.map(line =>
        line.trim() === ''
          ? '<div style="height:12px"></div>'
          : `<div class="sidebar-lyrics__line">${line}</div>`
      ).join('');
    } else {
      scroll.innerHTML = '<div class="sidebar-lyrics__line sidebar-lyrics__line--dim">Nenhuma letra disponível.</div>';
    }

    sidebar.classList.remove('closed');
    overlay.classList.remove('closed');
  };

  closeBtn.addEventListener('click', closeLyricsSidebar);
  overlay.addEventListener('click', closeLyricsSidebar);
}
