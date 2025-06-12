// modules/bannerHome.js

// ... (qualquer outro código ou variáveis que você possa ter aqui) ...

export function initBanner() { // O "export" aqui é crucial!
    // ID corrigido para 'heroSectionMainImage', conforme o HTML e o main.js
    const bannerElement = document.getElementById('heroSectionMainImage'); 
    
    const images = [
        'img/bg1.webp', // Adicione o caminho das suas imagens aqui
        'img/bg2.webp',
        'img/bg5.webp',
        'img/bg19.webp',
        'img/bg20.webp',
        'img/bg22.webp'
    ];
    let currentBannerIndex = 0;

    function changeBannerImage() {
        // Usar a variável 'bannerElement' que foi definida
        if (bannerElement) { 
            bannerElement.style.backgroundImage = `url('${images[currentBannerIndex]}')`;
            currentBannerIndex = (currentBannerIndex + 1) % images.length;
        } else {
            // Mensagem de erro atualizada para o ID e arquivo corretos
            console.error('Elemento "heroSectionMainImage" não encontrado em modules/bannerHome.js!'); 
        }
    }

    // A condição de inicialização deve verificar 'bannerElement'
    if (bannerElement && images.length > 0) {
        changeBannerImage();
        setInterval(changeBannerImage, 5000);
    }
}