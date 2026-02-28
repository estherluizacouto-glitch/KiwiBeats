import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // ELEMENTOS
    // ===============================

    const textarea = document.querySelector('.cta-box textarea');
    const modal = document.getElementById('modalOverlay');
    const btnCadastrar = document.querySelector('.btn-cadastrar');
    const btnEntrar = document.querySelector('.btn-entrar');
    const googleLoginBtn = document.getElementById('googleLoginBtn');

    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDividerText = document.getElementById('modalDividerText');
    const modalSecondaryBtn = document.getElementById('modalSecondaryBtn');
    const modalContainer = document.querySelector('.modal-container');

    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    const logoutBtn = document.getElementById('logoutBtn');

    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const creditsElement = document.getElementById('credits');


    // ===============================
    // FUNÇÕES
    // ===============================

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.href }
        });

        if (error) {
            console.error('Erro no login:', error.message);
            alert('Erro ao fazer login com Google');
        }
    }

    async function loadUserData() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!avatar || !name) return;

        if (user) {
            name.textContent = user.user_metadata?.full_name || 'Usuário';
            avatar.src = user.user_metadata?.avatar_url || 'assets/images/default-avatar.png';

            const { data } = await supabase
                .from('credits')
                .select('credits_remaining')
                .eq('user_id', user.id)
                .maybeSingle();

            if (data && creditsElement) {
                creditsElement.textContent = `${data.credits_remaining} créditos`;
            }
        } else {
            name.textContent = '';
            avatar.src = 'assets/images/default-avatar.png';
            if (creditsElement) creditsElement.textContent = '';
        }
    }

    function setModalMode(mode) {
        if (!modalContainer) return;

        modalContainer.classList.add('switching');

        setTimeout(() => {
            if (mode === 'cadastrar') {
                modalTitle.textContent = 'Crie sua conta';
                modalSubtitle.innerHTML = 'Bem-vindo ao KiwiBeats.<br>Crie sua conta e dê o play.';
                modalDividerText.textContent = 'Já tem uma conta?';
                modalSecondaryBtn.textContent = 'Entrar';
                modalSecondaryBtn.onclick = () => setModalMode('entrar');
            } else {
                modalTitle.textContent = 'Entre na sua conta';
                modalSubtitle.innerHTML = 'Que bom te ver de novo.<br>Faça login para continuar.';
                modalDividerText.textContent = 'Ainda não tem conta?';
                modalSecondaryBtn.textContent = 'Criar conta';
                modalSecondaryBtn.onclick = () => setModalMode('cadastrar');
            }

            modalContainer.classList.remove('switching');
        }, 200);
    }


    // ===============================
    // TEXTAREA AUTO HEIGHT + PLACEHOLDER
    // ===============================

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

        const frases = [
            'Descreva sua ideia...',
            'Faça uma música no estilo samba...',
            'Sertanejo universitário sobre amor...',
            'Som de guitarra por cima dessa música...',
            'Transforme essa letra em rock...'
        ];

        let fraseIndex = 0;
        let charIndex = 0;
        let escrevendo = true;
        let animandoPlaceholder = true;

        function digitar() {
            if (!animandoPlaceholder) {
                setTimeout(digitar, 500);
                return;
            }

            if (escrevendo) {
                if (charIndex <= frases[fraseIndex].length) {
                    textarea.placeholder = frases[fraseIndex].slice(0, charIndex++);
                    setTimeout(digitar, 80);
                } else {
                    escrevendo = false;
                    setTimeout(digitar, 1500);
                }
            } else {
                if (charIndex >= 0) {
                    textarea.placeholder = frases[fraseIndex].slice(0, charIndex--);
                    setTimeout(digitar, 40);
                } else {
                    escrevendo = true;
                    fraseIndex = (fraseIndex + 1) % frases.length;
                    charIndex = 0;
                    setTimeout(digitar, 300);
                }
            }
        }

        textarea.addEventListener('input', () => {
            animandoPlaceholder = textarea.value.length === 0;
            if (!animandoPlaceholder) textarea.placeholder = '';
        });

        digitar();
    }


    // ===============================
    // EVENTOS
    // ===============================

    if (googleLoginBtn) googleLoginBtn.addEventListener('click', loginWithGoogle);

    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', () => {
            setModalMode('cadastrar');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            setModalMode('entrar');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Sidebar
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
    
            if (toggleIcon) {
                if (sidebar.classList.contains('collapsed')) {
                    toggleIcon.setAttribute('data-lucide', 'chevron-right');
                } else {
                    toggleIcon.setAttribute('data-lucide', 'chevron-left');
                }
    
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Erro ao deslogar:', error.message);
                alert('Erro ao sair da conta');
            }
        });
    }


    // ===============================
    // AUTH STATE LISTENER
    // ===============================

    supabase.auth.onAuthStateChange((event) => {

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            loadUserData();
        }

        if (event === 'SIGNED_OUT') {
            loadUserData();
        }
    });


    // ===============================
    // INICIALIZAÇÕES
    // ===============================

    if (typeof lucide !== 'undefined') lucide.createIcons();
    loadUserData();

});
