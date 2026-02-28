import supabase from './supabaseClient.js';

// Usamos o DOMContentLoaded para garantir que o HTML já exista quando o JS rodar
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const textarea = document.querySelector('.cta-box textarea');
    const modal = document.getElementById('modalOverlay');
    const btnCadastrar = document.querySelector('.btn-cadastrar');
    const btnEntrar = document.querySelector('.btn-entrar');
    
    // ===== LÓGICA DO TEXTAREA =====
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
    
    // ===== AUTENTICAÇÃO SUPABASE =====
    async function loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href
            }
        });
    
        if (error) {
            console.error('Erro no login:', error.message);
            alert('Erro ao fazer login com Google');
        }
    }
    
    async function debugSession() {
        const { data, error } = await supabase.auth.getSession();
        console.log("SESSION:", data);
        if (error) console.log("ERROR:", error);
    }
    
    debugSession();
    
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', loginWithGoogle);
    }
    
    
    // ===== ANIMAÇÃO PLACEHOLDER =====
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
        if (!textarea) return; // Segurança
        
        // Se não for para animar (usuário está digitando), para o loop temporariamente
        if (!animandoPlaceholder) {
            setTimeout(digitar, 500); // Tenta verificar novamente em breve
            return;
        }

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
                setTimeout(digitar, 300);
            }
        }
    }

    if (textarea) {
        textarea.addEventListener('input', () => {
            if (textarea.value.length > 0) {
                animandoPlaceholder = false;
                textarea.placeholder = '';
            } else {
                animandoPlaceholder = true;
                // REMOVIDO: digitar(); <-- Não chame aqui! O loop já existe.
            }
        });
        digitar(); // Inicia o loop uma única vez
    }
    
    // ===== MODAL CONTROLS =====
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDividerText = document.getElementById('modalDividerText');
    const modalSecondaryBtn = document.getElementById('modalSecondaryBtn');
    const modalContainer = document.querySelector('.modal-container');
    
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
            if (e.target === modal) { // Fecha apenas se clicar no fundo
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }


    // ===== AUTH STATE (SIMPLIFICADO) =====
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            loadUserData(); 
        }
    
        if (event === 'SIGNED_OUT') {
            loadUserData(); 
        }
    });

    // ===== FUNÇÃO USUÁRIO (AJUSTADA) =====
    async function loadUserData() {
        // Pega a sessão atual de forma segura
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        const avatar = document.getElementById('userAvatar');
        const name = document.getElementById('userName');
        const creditsElement = document.getElementById('credits');

        if (!avatar || !name) return;

        if (user) {
            name.textContent = user.user_metadata?.full_name || 'Usuário';
            avatar.src = user.user_metadata?.avatar_url || 'assets/images/default-avatar.png';

            // Busca créditos
            const { data } = await supabase
                .from('credits')
                .select('credits_remaining')
                .eq('user_id', user.id)
                .maybeSingle(); // Use maybeSingle para não dar erro se não existir a linha

            if (data && creditsElement) {
                creditsElement.textContent = `${data.credits_remaining} créditos`;
            }
        } else {
            name.textContent = '';
            avatar.src = 'assets/images/default-avatar.png';
            if (creditsElement) creditsElement.textContent = '';
        }
    }
    // Inicializa os dados do usuário ao carregar a página
    loadUserData();

    // ===== SIDEBAR =====
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    
    if (openSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    
    // ===== LOGOUT =====
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await supabase.auth.signOut();
    
            if (error) {
                console.error('Erro ao deslogar:', error.message);
                alert('Erro ao sair da conta');
            }
        });
    }
    
});
