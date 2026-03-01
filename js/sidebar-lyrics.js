const sidebar = document.getElementById('sidebar-lyrics');
const overlay = document.getElementById('sidebar-lyrics-overlay');
const closeBtn = document.getElementById('sidebar-lyrics-close');

function closeLyricsSidebar() {
  sidebar.classList.add('closed');
  overlay.classList.add('closed');
}

function openLyricsSidebar() {
  sidebar.classList.remove('closed');
  overlay.classList.remove('closed');
}

closeBtn.addEventListener('click', closeLyricsSidebar);
overlay.addEventListener('click', closeLyricsSidebar);


// 🔥 AQUI começa a parte de carregar música
async function loadSong(songId) {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // 🎵 Atualiza capa
  document.getElementById('sidebar-lyrics-cover').src = data.cover_url;

  // 🎼 Atualiza título
  document.getElementById('sidebar-lyrics-title').innerText = data.title;

  // 🎧 Atualiza gênero
  document.getElementById('sidebar-lyrics-genre').innerText = data.style;

  // 📜 Atualiza letra (quando você tiver)
  if (data.lyrics) {
    document.querySelector('.sidebar-lyrics__scroll').innerText = data.lyrics;
  }
}
