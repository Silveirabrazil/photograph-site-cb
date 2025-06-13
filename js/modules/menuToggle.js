// js/modules/menuToggle.js

export function setupMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active'); // Adiciona/Remove a classe 'active'
            const icon = menuToggle.querySelector('i'); // Para mudar o ícone (hambúrguer para X)

            if (menu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Muda para X
                document.body.style.overflow = 'hidden'; // Impede scroll do body QUANDO O MENU ESTÁ ABERTO
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Volta para hambúrguer
                document.body.style.overflow = ''; // Permite scroll do body QUANDO O MENU ESTÁ FECHADO
            }
        });

        // Fechar menu ao clicar em um item do menu
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Pequeno atraso para permitir a navegação antes de fechar a animação
                setTimeout(() => {
                    menu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }, 300); // 300ms, o tempo da transição do menu
            });
        });
    } else {
        console.warn("Elementos de menu-toggle ou menu não encontrados para setupMenuToggle. Verifique seu HTML e loadHeaderFooter.");
    }
}