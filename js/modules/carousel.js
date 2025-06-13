// js/modules/carousel.js

import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export function initSwiperCarousel() {
    console.log('Inicializando Swiper Carousel...');

    const swiperContainer = document.querySelector('.mySwiper');
    if (!swiperContainer) {
        console.error('Elemento com a classe ".mySwiper" não encontrado. Verifique o HTML.');
        return;
    }

    if (typeof Swiper === 'undefined') {
        console.error('Swiper não está definido. Verifique a importação no carousel.js e se a URL está correta.');
        return;
    }

    const swiper = new Swiper(swiperContainer, {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 5.5,
        spaceBetween: 10,
        centeredSlides: true,
        grabCursor: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        breakpoints: {
            320: {
                slidesPerView: 4.2, // Ajuste para 1.2 ou 1.5 para dar uma sensação de que tem mais slides
                spaceBetween: 10,
                centeredSlides: true, // Centraliza em telas pequenas para que o item ativo esteja no meio
            },
            480: { // Um breakpoint intermediário para celulares maiores
                slidesPerView: 4.2,
                spaceBetween: 15,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 4.5, // Ajuste para 3.5 para mostrar parte do próximo slide
                spaceBetween: 15,
                centeredSlides: true
            },
            1024: {
                slidesPerView: 5.2,
                spaceBetween: 25,
                centeredSlides: true
            }
        },
    });

    console.log('Swiper Carousel inicializado com sucesso.');
}