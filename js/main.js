document.addEventListener('DOMContentLoaded', () => {

  const textarea = document.querySelector('.cta-box textarea');
  const modal = document.getElementById('modalOverlay');

  if (!textarea || !modal || !btnCadastrar) {
    console.error('Elementos não encontrados no DOM');
    return;
  }

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
  const modal = document.getElementById('modalOverlay');

  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDividerText = document.getElementById('modalDividerText');
  const modalSecondaryBtn = document.getElementById('modalSecondaryBtn');

  function setModalMode(mode) {
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

});
