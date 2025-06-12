// js/modules/menuToggle.js
export function setupMenuToggle() {
    const menuButton = document.querySelector('.menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}