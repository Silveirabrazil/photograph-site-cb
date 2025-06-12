// js/modules/gallery.js

export function initializeGalleryModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const captionText = document.getElementById('captionText');
    const closeButton = modal ? modal.querySelector('.close-button') : null;
    const galleryItems = document.querySelectorAll('.gallery-item img');

    // Checagem de elementos essenciais
    if (!modal || !modalImage || !captionText || !closeButton || !galleryItems.length) {
        console.error('Modal da galeria: Elementos necessários não encontrados no DOM.');
        return;
    }

    // Função para abrir o modal
    function openModal(fullSrc, altText, caption) {
        modalImage.src = fullSrc;
        modalImage.alt = altText || '';
        captionText.textContent = caption || '';
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
    }

    // Função para fechar o modal
    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = 'auto';
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';
        captionText.textContent = '';
    }

    // Evento para abrir o modal ao clicar em uma imagem da galeria
    galleryItems.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const fullSrc = img.getAttribute('data-full-src') || img.src;
            const altText = img.getAttribute('alt') || '';
            const caption = img.getAttribute('data-caption') || '';
            openModal(fullSrc, altText, caption);
        });
    });

    // Evento para fechar o modal no botão "X"
    closeButton.addEventListener('click', closeModal);

    // Evento para fechar o modal ao clicar fora do conteúdo da imagem
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Evento para fechar o modal com a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}