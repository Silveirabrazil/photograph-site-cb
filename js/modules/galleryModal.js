// js/modules/galleryModal.js

export function initializeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImage');
    const captionText = document.getElementById('galleryModalCaption');
    const closeBtn = document.querySelector('.close-button-gallery');
    const prevBtn = document.querySelector('.prev-button-gallery');
    const nextBtn = document.querySelector('.next-button-gallery');

    let currentImages = [];
    let currentIndex = 0;

    // Verificação de existência dos elementos essenciais do modal
    if (!modal || !modalImg || !captionText || !closeBtn || !prevBtn || !nextBtn) {
        console.warn("Um ou mais elementos do modal da galeria (IDs/classes 'galleryModal*', 'close-button-gallery', etc.) não foram encontrados. O modal da galeria não será inicializado.");
        return; // Sai da função se os elementos não existirem
    }

    // Seleciona todas as imagens que devem abrir neste modal.
    // Assegure-se de que seus itens de galeria tenham a classe .gallery-item
    // e que a imagem tenha o atributo data-full-src e data-caption.
    const galleryItems = document.querySelectorAll('.photo-grid .gallery-item img, .portfolio-category .portfolio-item img');

    if (galleryItems.length === 0) {
        console.log("Nenhuma imagem encontrada com os seletores da galeria (.photo-grid .gallery-item img, .portfolio-category .portfolio-item img). O modal de galeria funcionará apenas se as imagens forem adicionadas dinamicamente ou por outro script.");
        // Neste caso, o modal não terá imagens para navegar, mas os listeners básicos ainda estarão lá.
    } else {
        // Adiciona listener de clique para cada imagem da galeria
        galleryItems.forEach((img, index) => {
            img.style.cursor = 'pointer'; // Adiciona cursor de ponteiro para indicar que é clicável
            img.addEventListener('click', () => {
                // Atualiza a lista de imagens e o índice atual ao clicar
                // Isso é importante se você tiver múltiplas galerias e só quer navegar nas imagens da galeria clicada.
                // Se todas as imagens de .photo-grid e .portfolio-category são uma única galeria, este filtro está ok.
                currentImages = Array.from(galleryItems);
                currentIndex = index;
                openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
            });
        });
    }

    function openModal(src, alt, caption) {
        modal.classList.add('is-open');
        modalImg.src = src;
        modalImg.alt = alt;
        captionText.textContent = caption || alt || ''; // Usa caption, alt ou vazio
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Impede o scroll do body
        modal.focus(); // Coloca o foco no modal para acessibilidade
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modalImg.src = ''; // Limpa a imagem
        captionText.textContent = ''; // Limpa a legenda
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaura o scroll do body
    }

    // Event Listeners para o modal
    closeBtn.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', () => {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            const img = currentImages[currentIndex];
            openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            const img = currentImages[currentIndex];
            openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
        }
    });

    // Fechar modal clicando no fundo (mas não na imagem ou botões de navegação)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Apenas se o clique for diretamente no fundo do modal
            closeModal();
        }
    });

    // Navegação por teclado (Escape para fechar, setas para navegar)
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('is-open')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
}