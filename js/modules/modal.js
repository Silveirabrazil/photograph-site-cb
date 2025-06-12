export function setupModal() {
    const openModalButton = document.querySelector('[data-modal-open]');
    const closeModalButton = document.querySelector('[data-modal-close]');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('captionText');

    // Abrir modal pelo botão de teste
    if (openModalButton && modal) {
        openModalButton.addEventListener('click', () => {
            modal.classList.add('is-open');
            modalImg.src = ''; // Limpa a imagem
            captionText.textContent = '';
        });
    }

    // Fechar modal pelo botão de fechar
    if (closeModalButton && modal) {
        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('is-open');
            modalImg.src = '';
            captionText.textContent = '';
        });
    }

    // Fechar modal clicando fora do conteúdo
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-open');
                modalImg.src = '';
                captionText.textContent = '';
            }
        });
    }

    // Abrir modal ao clicar em imagens do carrossel
    const carouselImages = document.querySelectorAll('.carousel-item img, .swiper-slide img');
    carouselImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            modal.classList.add('is-open');
            modalImg.src = img.src;
            captionText.textContent = img.alt || '';
        });
    });
}