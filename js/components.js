import { initSidebar } from './sidebar.js';
import supabase from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", async () => {

  function loadComponent(containerId, filePath, callback = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(filePath)
      .then(res => res.text())
      .then(data => {
        container.innerHTML = data;

        if (window.lucide) {
          lucide.createIcons();
        }

        if (callback) callback();
      });
  }

  // Sidebar
  loadComponent(
    "sidebar-container",
    "components/sidebar.html",
    () => {
      initSidebar(supabase);
    }
  );

  // Player
  loadComponent(
    "music-player-container",
    "components/music-player.html",
    () => {
      if (typeof initMusicPlayer === "function") {
        initMusicPlayer();
      }
    }
  );

});
