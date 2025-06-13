// js/modules/galleryModal.js

export function initializeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImage');
    const captionText = document.getElementById('galleryModalCaption');
    const closeBtn = document.querySelector('.close-button-gallery');
    const prevBtn = document.querySelector('.prev-button-gallery');
    const nextBtn = document.querySelector('.next-button-gallery');

    let currentImages = []; // Lista de imagens da galeria ativa
    let currentIndex = 0;   // Índice da imagem atual na galeria ativa

    // Verificação de existência dos elementos essenciais do modal
    if (!modal || !modalImg || !captionText || !closeBtn || !prevBtn || !nextBtn) {
        console.warn("Um ou mais elementos do modal da galeria (IDs/classes 'galleryModal*', 'close-button-gallery', etc.) não foram encontrados. O modal da galeria não será inicializado.");
        return;
    }

    // Seletores para todas as imagens que podem abrir o modal (sejam de galerias ou carrosséis)
    const allGalleryTriggers = document.querySelectorAll(
        '.photo-grid .gallery-item img, ' + // Para grades de fotos (se você tiver)
        '.portfolio-category .portfolio-item img, ' + // Para itens de portfólio (se você tiver)
        '.swiper .swiper-slide img, ' + // Adicionado/Corrigido para carrossel Swiper
        '.feature-item-header img' // Adicionado para as imagens dentro das seções "feature-item"
    );

    if (allGalleryTriggers.length === 0) {
        console.log("Nenhuma imagem encontrada com os seletores da galeria. O modal de galeria pode não ter conteúdo para exibir.");
    } else {
        allGalleryTriggers.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                console.log("DEBUG: Imagem clicada:", img);

                // Identifica o contêiner pai da imagem clicada para agrupar as imagens da "galeria"
                // Ajustado para incluir '.feature-item-header' como um "pai" de galeria
                let parentGallery = img.closest('.photo-grid, .portfolio-category, .swiper, .feature-item');

                if (parentGallery) {
                    // Coleta APENAS as imagens do contêiner pai específico que têm data-full-src
                    currentImages = Array.from(parentGallery.querySelectorAll('img[data-full-src]'));
                    currentIndex = currentImages.indexOf(img); // Garante que o índice é o correto dentro da sub-galeria
                    console.log(`DEBUG: Imagens da galeria atual (${parentGallery.className}):`, currentImages.length);
                } else {
                    // Fallback: se não encontrar um pai específico, pega todas as imagens elegíveis com data-full-src
                    currentImages = Array.from(document.querySelectorAll('img[data-full-src]'));
                    currentIndex = currentImages.indexOf(img); // Garante que o índice é o correto dentro da lista completa
                    console.log("DEBUG: Não encontrou contêiner pai específico. Usando todas as imagens elegíveis com data-full-src.");
                }

                openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
            });
        });
    }

    function openModal(src, alt, caption) {
        console.log("DEBUG: openModal() chamado com src:", src);
        modal.classList.add('is-open');
        modalImg.src = src;
        modalImg.alt = alt;
        captionText.textContent = caption || alt || ''; // Usa caption, alt, ou string vazia
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Impede o scroll do body
        modal.focus(); // Coloca o foco no modal para acessibilidade
    }

    function closeModal() {
        console.log("DEBUG: Fechando modal.");
        modal.classList.remove('is-open');
        modalImg.src = ''; // Limpa a imagem
        captionText.textContent = ''; // Limpa a legenda
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaura o scroll do body
        // Opcional: tentar devolver o foco para o elemento que abriu o modal (mais complexo de implementar)
    }

    // Event listeners para fechar o modal
    closeBtn.addEventListener('click', closeModal);

    // Event listeners para navegação
    prevBtn.addEventListener('click', () => {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            const img = currentImages[currentIndex];
            openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
            console.log("DEBUG: Navegando para imagem anterior. Novo índice:", currentIndex);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            const img = currentImages[currentIndex];
            openModal(img.getAttribute('data-full-src'), img.alt, img.getAttribute('data-caption'));
            console.log("DEBUG: Navegando para próxima imagem. Novo índice:", currentIndex);
        }
    });

    // Fechar modal ao clicar no fundo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Apenas se clicar diretamente no fundo do modal
            closeModal();
        }
    });

    // Fechar e navegar com teclas
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