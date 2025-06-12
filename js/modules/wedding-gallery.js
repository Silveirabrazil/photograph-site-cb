// js/modules/wedding-gallery.js

export function initializeWeddingGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('weddingGalleryModal');
    const modalImage = document.getElementById('weddingModalImage');
    const modalCaption = document.getElementById('weddingModalCaption');
    const closeButton = document.querySelector('.close-button-wedding');
    const prevButton = document.querySelector('.prev-button-wedding');
    const nextButton = document.querySelector('.next-button-wedding');

    // Adicionado log para depuração: verificar se os elementos do modal foram encontrados
    if (!modal || !modalImage || !modalCaption || !closeButton || !prevButton || !nextButton) {
        console.error("Erro: Um ou mais elementos do modal da galeria de casamentos não foram encontrados no DOM. Verifique seus IDs e classes.");
        return; // Sai da função se os elementos essenciais não existirem
    }

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(img => ({
        fullSrc: img.dataset.fullSrc,
        alt: img.alt,
        caption: img.dataset.caption
    }));

    // Abre o modal ao clicar em uma imagem da galeria
    galleryItems.forEach((imgElement, index) => {
        imgElement.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão, se houver
            currentImageIndex = index;
            showImageInModal(currentImageIndex);
            modal.classList.add('open'); // Adiciona a classe 'open' para mostrar o modal
            document.body.style.overflow = 'hidden'; // Impede o scroll do corpo
        });
    });

    // Função para exibir a imagem no modal
    function showImageInModal(index) {
        if (index >= 0 && index < images.length) {
            modalImage.src = images[index].fullSrc;
            modalImage.alt = images[index].alt;
            modalCaption.textContent = images[index].caption;
            currentImageIndex = index;
        }
    }

    // Navegação para a imagem anterior
    prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImageInModal(currentImageIndex);
    });

    // Navegação para a próxima imagem
    nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImageInModal(currentImageIndex);
    });

    // Fecha o modal
    closeButton.addEventListener('click', () => {
        modal.classList.remove('open'); // Remove a classe 'open' para esconder o modal
        document.body.style.overflow = ''; // Restaura o scroll do corpo
    });

    // Fecha o modal ao clicar fora da imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Verifica se o clique foi diretamente no overlay do modal
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Restaura o scroll do corpo
        }
    });

    // Fecha o modal com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Restaura o scroll do corpo
        }
    });
}