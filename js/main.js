// js/main.js

import { setupModal } from './modules/modal.js';
import { setupMenuToggle } from './modules/menuToggle.js';
import { initBanner as initBannerHome } from './modules/bannerHome.js';
import { initBanner as initBannerPages } from './modules/bannerPages.js';
import { initLayoutLoader } from './modules/layoutLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM totalmente carregado. Inicializando scripts.');

    // Módulos globais
    setupMenuToggle();
    initLayoutLoader();
    setupModal(); // Chame sempre para configurar listeners básicos do modal.

    // Inicialização condicional do banner
    if (document.querySelector('.hero-section')) {
        console.log('Elemento .hero-section encontrado. Inicializando banner da Home.');
        initBannerHome();
    }
    else if (document.querySelector('.page-banner-section')) {
        console.log('Elemento .page-banner-section encontrado. Inicializando banner das Páginas.');
        initBannerPages();
    } else {
        console.log('Nenhum banner principal ou de página encontrado para inicializar.');
    }

    // Inicializações condicionais para outras seções

    // Swiper Carousel
    if (document.querySelector('.mySwiper')) {
        import('./modules/carousel.js').then(({ initSwiperCarousel }) => {
            console.log('Elemento .mySwiper encontrado. Inicializando carrossel.');
            initSwiperCarousel();
        }).catch(error => {
            console.error('Erro ao carregar o módulo carousel.js:', error);
        });
    }

    // Modal da galeria de casamentos (seções com a classe .gallery-section)
    // ATENÇÃO: Nome da função mudou para initializeWeddingGalleryModal
    // e nome do arquivo para wedding-gallery.js
    if (document.querySelector('.gallery-section')) {
        import('./modules/wedding-gallery.js').then(({ initializeWeddingGalleryModal }) => {
            console.log('Elemento .gallery-section encontrado. Inicializando modal da galeria de casamentos.');
            initializeWeddingGalleryModal();
        }).catch(error => {
            console.error('Erro ao carregar o módulo wedding-gallery.js:', error);
        });
    }

    // Galeria de portfólio (seções com a classe .portfolio-category)
    if (document.querySelector('.portfolio-category')) {
        import('./modules/portfolioGallery.js').then(({ initPortfolioGallery }) => {
            console.log('Elemento .portfolio-category encontrado. Inicializando galeria de portfólio.');
            initPortfolioGallery();
        }).catch(error => {
            console.error('Erro ao carregar o módulo portfolioGallery.js:', error);
        });
    }
});