// js/modules/layoutLoader.js

/**
 * Carrega conteúdo HTML de um arquivo e o insere em um elemento específico.
 * @param {string} url O caminho para o arquivo HTML (ex: '../modules/header.html').
 * @param {string} elementId O ID do elemento onde o conteúdo será inserido (ex: 'header-placeholder').
 */
async function loadHtmlIntoElement(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not load ${url}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            console.log(`Successfully loaded ${url} into #${elementId}`);
        } else {
            console.warn(`Element with ID '${elementId}' not found for ${url}.`);
        }
    } catch (error) {
        console.error(`Error loading HTML from ${url}:`, error);
        throw error;
    }
}

/**
 * Inicializa o carregamento do layout (header e footer).
 * Esta função agora é assíncrona e retorna uma Promise.
 */
export async function initLayoutLoader() {
    try {
        // CORREÇÃO AQUI: '../' significa 'voltar um diretório'.
        // Se layoutLoader.js está em /js/modules/, '../' vai para /js/
        // E mais um '../' vai para a raiz do projeto.
        // Assim, '../../modules/header.html' NÃO ESTÁ CERTO SE HEADER.HTML ESTÁ EM modules/ NA RAIZ
        // O CORRETO É: 'modules/header.html' SE layouLoader.js ESTIVER NA RAIZ
        // OU '../../modules/header.html' SE layoutLoader.js ESTIVER EM UMA SUB-PASTA COMO js/modules/
        // Ah, espere! A URL que o navegador tentou foi http://127.0.0.1:5500/modules/header.html
        // Isso sugere que a pasta 'modules' está na RAIZ do seu site.
        // E o layoutLoader.js está em js/modules/.

        // Então, do layoutLoader.js (que está em js/modules/), para chegar em modules/header.html (na raiz)
        // Você precisa sair da pasta 'modules' (../) e sair da pasta 'js' (../)
        // E então entrar na pasta 'modules' que está na raiz.

        await loadHtmlIntoElement('modules/header.html', 'header-placeholder'); // <-- Caminho Corrigido
        await loadHtmlIntoElement('modules/footer.html', 'footer-placeholder'); // <-- Caminho Corrigido
        console.log("Layout (Header e Footer) carregado com sucesso.");
        return true;
    } catch (error) {
        console.error("Falha ao inicializar o layout (Header/Footer):", error);
        return false;
    }
}