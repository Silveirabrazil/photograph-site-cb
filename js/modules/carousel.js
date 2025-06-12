// js/modules/carousel.js

// IMPORTAÇÃO CORRIGIDA DO SWIPER
// Certifique-se de que o Swiper é acessível através deste caminho no seu servidor ou CDN.
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// REMOVIDO: import { sassFalse } from 'sass'; // Não necessário
// REMOVIDO: import 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'; // O CSS deve ser linkado no HTML

export function initSwiperCarousel() {
    console.log('Inicializando Swiper Carousel...');

    // O elemento com a classe 'mySwiper' precisa existir no DOM para o Swiper ser inicializado.
    const swiperContainer = document.querySelector('.mySwiper');
    if (!swiperContainer) {
        console.error('Elemento com a classe ".mySwiper" não encontrado. Verifique o HTML.');
        return;
    }

    if (typeof Swiper === 'undefined') {
        console.error('Swiper não está definido. Verifique a importação no carousel.js e se a URL está correta.');
        return;
    }

    const swiper = new Swiper(swiperContainer, { // Passamos a referência do elemento
        direction: 'horizontal',
        loop: true, // Habilita o loop infinito do carrossel
        slidesPerView: 5, // Padrão para telas maiores ou quando nenhum breakpoint se aplica
        spaceBetween: 10, // Espaço entre os slides
        centeredSlides: true, // Centraliza o slide ativo
        grabCursor: true, // Altera o cursor para indicar que é arrastável

        pagination: {
            el: '.swiper-pagination', // Seletor para o elemento de paginação
            clickable: true, // Permite clicar nas bolinhas para navegar
        },

        navigation: {
            nextEl: '.swiper-button-next', // Seletor para o botão "próximo"
            prevEl: '.swiper-button-prev', // Seletor para o botão "anterior"
        },

        autoplay: {
            delay: 3000, // Tempo de espera em ms antes de trocar para o próximo slide
            disableOnInteraction: false, // O autoplay não para quando o usuário interage com o carrossel
        },

        // Configurações responsivas (breakpoints)
        breakpoints: {
            // Quando a largura da tela for >= 320px
            320: {
                slidesPerView: 3, // Exibe 1 slide em telas muito pequenas
                spaceBetween: 10,
                centeredSlides: true, // Não centraliza em telas pequenas para evitar cortes
            },
            // Quando a largura da tela for >= 768px
            768: {
                slidesPerView: 2, // Exibe 2 slides em tablets
                spaceBetween: 10,
                centeredSlides: true // Centraliza novamente
            },
            // Quando a largura da tela for >= 1024px
            1024: {
                slidesPerView: 5, // Exibe 3 slides em telas maiores
                spaceBetween: 10,
                centeredSlides: true
            }
            // OBS: Se você quer 5 slides para 1024px como tinha antes, ajuste aqui:
            // 1024: {
            //     slidesPerView: 5,
            //     spaceBetween: 30,
            //     centeredSlides: true
            // }
        },
    });

    console.log('Swiper Carousel inicializado com sucesso.');
}