import supabase from './supabaseClient.js'

let currentTimeUpdateHandler = null;

function initLyricsSidebar() {
  const sidebar = document.getElementById('sidebar-lyrics');
  const overlay = document.getElementById('sidebar-lyrics-overlay');
  const closeBtn = document.getElementById('sidebar-lyrics-close');

  function closeLyricsSidebar() {
    sidebar.classList.add('closed');
    overlay.classList.add('closed');
  }

  window.openLyricsSidebar = function(song) {
    // Preenche dados
    document.getElementById('sidebar-lyrics-cover').src = song.cover_url || '';
    document.getElementById('sidebar-lyrics-title').innerText = song.title || '—';
    document.getElementById('sidebar-lyrics-genre').innerText = song.style || '—';

    const scroll = document.getElementById('sidebar-lyrics-scroll');
    scroll.innerHTML = '';

    if (song.lyrics_lrc) {

      const lyrics = parseLRC(song.lyrics_lrc);
      renderLyrics(lyrics);

      const player = document.getElementById('#music-player audio');

      if (player && lyrics.length > 0) {
        syncLyrics(player, lyrics);
      }

    } else {
      scroll.innerHTML =
        '<div class="sidebar-lyrics__line sidebar-lyrics__line--dim">Nenhuma letra disponível.</div>';
    }

    sidebar.classList.remove('closed');
    overlay.classList.remove('closed');
  };

  closeBtn.addEventListener('click', closeLyricsSidebar);
  overlay.addEventListener('click', closeLyricsSidebar);
}

window.initLyricsSidebar = initLyricsSidebar;



// =======================
// PARSE LRC
// =======================

export function parseLRC(lrcText) {
  if (!lrcText) return [];

  const lines = lrcText.split('\n');
  const lyrics = [];

  lines.forEach(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;

      lyrics.push({
        time,
        text: match[3].trim()
      });
    }
  });

  return lyrics;
}



// =======================
// RENDER LYRICS
// =======================

export function renderLyrics(lyrics) {
  const container = document.getElementById('sidebar-lyrics-scroll');
  container.innerHTML = '';

  lyrics.forEach((line, index) => {
    const div = document.createElement('div');
    div.classList.add('sidebar-lyrics__line');
    div.dataset.index = index;
    div.textContent = line.text;
    container.appendChild(div);
  });
}



// =======================
// SYNC LYRICS
// =======================

export function syncLyrics(player, lyrics) {
  if (!player || !lyrics || lyrics.length === 0) return;

  // Remove listener antigo se existir
  if (currentTimeUpdateHandler) {
    player.removeEventListener('timeupdate', currentTimeUpdateHandler);
    currentTimeUpdateHandler = null;
  }

  currentTimeUpdateHandler = function () {
    const currentTime = player.currentTime;
    for (let i = 0; i < lyrics.length; i++) {
      if (
        currentTime >= lyrics[i].time &&
        (!lyrics[i + 1] || currentTime < lyrics[i + 1].time)
      ) {
        highlightLine(i);
        break;
      }
    }
  };

  // Sempre adiciona o timeupdate diretamente — funciona pausado e tocando
  player.addEventListener('timeupdate', currentTimeUpdateHandler);

  // Dispara uma vez imediatamente para sincronizar o estado atual
  currentTimeUpdateHandler();
}


// =======================
// HIGHLIGHT LINE
// =======================

function highlightLine(index) {
  const lines = document.querySelectorAll('.sidebar-lyrics__line');

  lines.forEach(line =>
    line.classList.remove('sidebar-lyrics__line--active')
  );

  const activeLine = lines[index];

  if (activeLine) {
    activeLine.classList.add('sidebar-lyrics__line--active');

    activeLine.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}
