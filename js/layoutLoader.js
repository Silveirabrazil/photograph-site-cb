/**
 * Carrega conteúdo HTML de um arquivo e o insere em um elemento específico.
 * @param {string} url O caminho para o arquivo HTML (ex: 'partials/header.html').
 * @param {string} elementId O ID do elemento onde o conteúdo será inserido (ex: 'header-placeholder').
 */
async function loadHtmlIntoElement(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with ID '${elementId}' not found.`);
        }
    } catch (error) {
        console.error(`Could not load HTML from ${url}:`, error);
    }
}

export function initLayoutLoader() {
    // CORREÇÃO APLICADA AQUI: Removido o '/' inicial
    loadHtmlIntoElement('header.html', 'header-placeholder'); // Sem barra inicial
    loadHtmlIntoElement('footer.html', 'footer-placeholder'); // Sem barra inicial
    // Se o modal também for carregado aqui:
    // loadHtmlIntoElement('modal.html', 'modal-placeholder'); // Exemplo
}