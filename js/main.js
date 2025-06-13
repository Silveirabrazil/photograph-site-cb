// js/main.js

import { setupModal } from './modules/modal.js';
import { setupMenuToggle } from './modules/menuToggle.js';
import { initBanner as initBannerHome } from './modules/bannerHome.js';
import { initBanner as initBannerPages } from './modules/bannerPages.js';
import { initLayoutLoader } from './modules/layoutLoader.js';

// Importa o módulo da galeria genérica
import { initializeGalleryModal } from './modules/galleryModal.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM totalmente carregado. Inicializando scripts.');

    // --- MÓDULOS QUE PODEM SER INICIALIZADOS IMEDIATAMENTE APÓS DOMContentLoaded ---
    // Eles não dependem do conteúdo injetado por initLayoutLoader.

    // Inicialização condicional do banner
    if (document.querySelector('.hero-section')) {
        console.log('Elemento .hero-section encontrado. Inicializando banner da Home.');
        initBannerHome();
    } else if (document.querySelector('.page-banner-section')) {
        console.log('Elemento .page-banner-section encontrado. Inicializando banner das Páginas.');
        initBannerPages();
    } else {
        console.log('Nenhum banner principal ou de página encontrado para inicializar.');
    }

    // Swiper Carousel
    if (document.querySelector('.mySwiper')) {
        import('./modules/carousel.js').then(({ initSwiperCarousel }) => {
            console.log('Elemento .mySwiper encontrado. Inicializando carrossel.');
            initSwiperCarousel();
        }).catch(error => {
            console.error('Erro ao carregar o módulo carousel.js:', error);
        });
    }

    // Modal da galeria de fotos (ele também parece estar no index.html)
    if (document.querySelector('.gallery-section') || document.querySelector('.portfolio-category') || document.getElementById('galleryModal')) {
        console.log('Elementos para galeria de fotos encontrados. Inicializando modal de galeria genérico.');
        initializeGalleryModal();
    }

    // Galeria de portfólio (se não injetada, pode ir aqui também)
    if (document.querySelector('.portfolio-category')) {
        import('./modules/portfolioGallery.js').then(({ initPortfolioGallery }) => {
            console.log('Elemento .portfolio-category encontrado. Inicializando galeria de portfólio.');
            initPortfolioGallery();
        }).catch(error => {
            console.error('Erro ao carregar o módulo portfolioGallery.js:', error);
        });
    }


    // --- MÓDULOS QUE DEPENDEM DO LAYOUT (HEADER/FOOTER) SER CARREGADO ---
    // Estes permanecem dentro do .then() de initLayoutLoader.
    initLayoutLoader().then(success => {
        if (success) {
            console.log("Layout (Header e Footer) carregado com sucesso. Inicializando módulos dependentes.");
            // setupMenuToggle depende do header.html (que contém .menu-toggle e .menu)
            setupMenuToggle();
            // setupModal também pode depender de elementos dentro do header ou footer,
            // ou do modal estar no index.html, mas é bom mantê-lo aqui por segurança se ele
            // interage com elementos injetados ou globalmente disponíveis.
            setupModal();

        } else {
            console.error("Falha ao inicializar o layout. Alguns scripts podem não funcionar.");
        }
    }).catch(error => {
        console.error("Erro crítico na inicialização do layout:", error);
    });
});