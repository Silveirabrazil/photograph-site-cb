// js/modules/modal.js

export function setupModal() { // Certifique-se que é exportada
    const openModalButton = document.querySelector('[data-modal-open]'); // Este parece ser um botão de teste
    const closeModalButton = document.querySelector('[data-modal-close]');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('captionText');

    if (!modal || !modalImg || !captionText) {
        console.error("Elementos do modal não encontrados. Verifique o HTML e os IDs.");
        return;
    }

    // Abrir modal pelo botão de teste (se ainda existir)
    if (openModalButton) {
        openModalButton.addEventListener('click', () => {
            modal.classList.add('is-open');
            modalImg.src = ''; // Limpa a imagem
            captionText.textContent = '';
            modal.setAttribute('aria-hidden', 'false'); // Acessibilidade
        });
    }

    // Fechar modal pelo botão de fechar
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('is-open');
            modalImg.src = '';
            captionText.textContent = '';
            modal.setAttribute('aria-hidden', 'true'); // Acessibilidade
        });
    }

    // Fechar modal clicando fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
            modalImg.src = '';
            captionText.textContent = '';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    // Abrir modal ao clicar em imagens do carrossel
    // Seleciona todas as imagens que estão dentro de um slide do Swiper
    const carouselImages = document.querySelectorAll('.swiper-slide img');
    
    if (carouselImages.length === 0) {
        console.warn("Nenhuma imagem de carrossel encontrada com o seletor '.swiper-slide img'.");
    }

    carouselImages.forEach(img => {
        img.style.cursor = 'pointer'; // Adiciona um cursor de ponteiro para indicar que é clicável
        img.addEventListener('click', () => {
            modal.classList.add('is-open');
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'Imagem ampliada do carrossel'; // Define alt para acessibilidade
            captionText.textContent = img.alt || ''; // Usa o alt da imagem como legenda
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            modal.classList.remove('is-open');
            modalImg.src = '';
            captionText.textContent = '';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}