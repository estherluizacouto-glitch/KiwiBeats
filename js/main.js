document.addEventListener('DOMContentLoaded', () => {

  const textarea = document.querySelector('.cta-box textarea');
  const modal = document.getElementById('modalOverlay');
  const btnCadastrar = document.querySelector('.btn-cadastrar');

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
  const btnCadastrar = document.querySelector('.btn-cadastrar');

  btnCadastrar.addEventListener('click', () => {
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
