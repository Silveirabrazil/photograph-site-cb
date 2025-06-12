/**
 * Carrega conteúdo HTML de um arquivo e o insere em um elemento específico.
 * @param {string} url O caminho para o arquivo HTML (ex: 'modules/header.html').
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
    // ESTA É A VERSÃO CORRETA PARA A PASTA 'modules'
    loadHtmlIntoElement('modules/header.html', 'header-placeholder'); 
    loadHtmlIntoElement('modules/footer.html', 'footer-placeholder'); 
    // Se o modal também estiver na pasta 'modules' e for carregado por aqui:
    // loadHtmlIntoElement('modules/modal.html', 'modal-placeholder'); // Exemplo
}