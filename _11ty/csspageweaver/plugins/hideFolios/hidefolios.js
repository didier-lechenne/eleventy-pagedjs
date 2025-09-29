/**
 * @name Hide Folios
 * @file Script pour gérer le toggle et les paramètres
 */

export default function hideFolios() {
  const body = cssPageWeaver.ui.body;
  const fileTitle = cssPageWeaver.docTitle;
  const parameters = cssPageWeaver.features.hideFolios?.parameters || {};
  
  // Vérifier que l'UI est bien initialisée
  if (!cssPageWeaver.ui.hideFolios) {
    console.warn('UI hideFolios non initialisée');
    return;
  }
  
  const toggleInput = cssPageWeaver.ui.hideFolios.toggleInput;
  const pagesInput = document.querySelector('#hidefolios-pages');
  
  // Restaurer l'état du toggle depuis localStorage
  const isActive = localStorage.getItem('hideFolios_' + fileTitle) === 'true';
  toggleInput.checked = isActive;
  
  // Restaurer la valeur des pages
  const savedPages = localStorage.getItem('hideFoliosPages_' + fileTitle) || parameters.pages || '';
  if (pagesInput) {
    pagesInput.value = savedPages;
  }
  
  // Fonction toggle
  function toggleHideFolios() {
    const newState = toggleInput.checked;
    localStorage.setItem('hideFolios_' + fileTitle, newState);
    
    // Recharger pour appliquer
    location.reload();
  }
  
  // Sauvegarder les pages à chaque modification
  if (pagesInput) {
    let timeout;
    pagesInput.addEventListener("input", (e) => {
      const value = e.target.value;
      localStorage.setItem('hideFoliosPages_' + fileTitle, value);
      
      // Recharger après 1 seconde d'inactivité
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
  
  // Event listener pour le toggle
  toggleInput.addEventListener("input", toggleHideFolios);
}