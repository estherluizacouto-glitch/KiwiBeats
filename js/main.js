import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://gevwfciirevgbrzklrpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdldndmY2lpcmV2Z2JyemtscnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTg0NTgsImV4cCI6MjA4NjIzNDQ1OH0.auWkhHSUy9mzk-2U0AYExgzf90MQbZ6PPd98VhJMN4w'
)

document.addEventListener('DOMContentLoaded', () => {

  const textarea = document.querySelector('.cta-box textarea');
  const modal = document.getElementById('modalOverlay');
  const btnCadastrar = document.querySelector('.btn-cadastrar');
  const btnEntrar = document.querySelector('.btn-entrar');

  if (textarea) {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      const maxHeight = 240;
      if (textarea.scrollHeight <= maxHeight) {
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
      }
    });
  }

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href
      }
    });

    if (error) {
      console.error('Erro no login:', error.message)
      alert('Erro ao fazer login com Google')
    }
  }

  async function debugSession() {
    const { data, error } = await supabase.auth.getSession();
    console.log("SESSION:", data);
    console.log("ERROR:", error);
  }

  debugSession();

  const googleLoginBtn = document.getElementById('googleLoginBtn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', loginWithGoogle)
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('Logado:', session.user)

      modal.classList.remove('active')
      document.body.style.overflow = 'auto'

      localStorage.setItem('access_token', session.access_token)
    }

    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('access_token')
    }
  });

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    const maxHeight = 240;
    if (textarea.scrollHeight <= maxHeight) {
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    }
  });

  const frases = [
    'Descreva sua ideia...',
    'Faça uma música no estilo samba com a seguinte letra...',
    'Faça uma música de sertanejo universitário sobre um amor não correspondido...',
    'Coloque o som de guitarra por cima dessa música...',
    'Transforme essa letra em uma música no estilo rock...'
  ];

  let fraseIndex = 0;
  let charIndex = 0;
  let escrevendo = true;
  let animandoPlaceholder = true;

  function digitar() {
    if (!animandoPlaceholder) return;

    if (escrevendo) {
      if (charIndex <= frases[fraseIndex].length) {
        textarea.placeholder = frases[fraseIndex].slice(0, charIndex);
        charIndex++;
        setTimeout(digitar, 80);
      } else {
        escrevendo = false;
        setTimeout(digitar, 1500);
      }
    } else {
      if (charIndex >= 0) {
        textarea.placeholder = frases[fraseIndex].slice(0, charIndex);
        charIndex--;
        setTimeout(digitar, 40);
      } else {
        escrevendo = true;
        fraseIndex = (fraseIndex + 1) % frases.length;
        charIndex = 0;
        textarea.placeholder = '';
        setTimeout(digitar, 300);
      }
    }
  }

  textarea.addEventListener('input', () => {
    if (textarea.value.length > 0) {
      animandoPlaceholder = false;
      textarea.placeholder = '';
    } else if (!animandoPlaceholder) {
      animandoPlaceholder = true;
      fraseIndex = 0;
      charIndex = 0;
      escrevendo = true;
      digitar();
    }
  });

  digitar();

  // ===== MODAL =====
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDividerText = document.getElementById('modalDividerText');
  const modalSecondaryBtn = document.getElementById('modalSecondaryBtn');
  const modalContainer = document.querySelector('.modal-container');

  function setModalMode(mode) {
    modalContainer.classList.add('switching');

    setTimeout(() => {
      if (mode === 'cadastrar') {
        modalTitle.textContent = 'Crie sua conta';
        modalSubtitle.innerHTML = `
          Bem-vindo ao KiwiBeats.<br>
          Crie sua conta e dê o play na sua criatividade.
        `;

        modalDividerText.textContent = 'Já tem uma conta?';
        modalSecondaryBtn.textContent = 'Entrar';

        modalSecondaryBtn.onclick = () => setModalMode('entrar');
    }

      if (mode === 'entrar') {
        modalTitle.textContent = 'Entre na sua conta';
        modalSubtitle.innerHTML = `
          Que bom te ver de novo.<br>
          Faça login para continuar criando música.
        `;

        modalDividerText.textContent = 'Ainda não tem conta?';
        modalSecondaryBtn.textContent = 'Criar conta';

        modalSecondaryBtn.onclick = () => setModalMode('cadastrar');
      }

      modalContainer.classList.remove('switching');
    }, 200);
  }


  btnCadastrar.addEventListener('click', () => {
    setModalMode('cadastrar');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  btnEntrar.addEventListener('click', () => {
    setModalMode('entrar');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  modal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const toggleIcon = document.getElementById('toggleIcon');

  toggleBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    toggleIcon.className = isCollapsed 
      ? 'fa-solid fa-chevron-right' 
      : 'fa-solid fa-chevron-left';
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const toggleIcon = document.getElementById('toggleIcon');
  
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  
  const isCollapsed = sidebar.classList.contains('collapsed');
  
  toggleIcon.setAttribute(
    "data-lucide",
    isCollapsed ? "chevron-right" : "chevron-left"
  );

  lucide.createIcons();
});

  
async function loadUserData() {
  const { data: { user } } = await supabase.auth.getUser();

  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userName');

  if(user) {
    name.textContent = user.user_metadata.full_name;
    avatar.src = user.user_metadata.avatar_url;
  } else {
    name.textContent = '';
    avatar.src = 'assets/images/default-avatar.png';
  }
}

loadUserData();

supabase.auth.onAuthStateChange((_event, session) => {
  loadUserData();
});



const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();

  localStorage.clear();
  sessionStorage.clear();

  window.location.href = '/KiwiBeats';
});

});
