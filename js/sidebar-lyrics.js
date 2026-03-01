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
