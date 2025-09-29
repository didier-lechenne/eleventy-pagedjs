/**
 * @name Hide Folios
 * @file Script pour masquer les folios
 */

import hideFoliosData from './hideFolios-data.js';

export default function hidefolios() {
  const toggleInput = cssPageWeaver.ui.hideFolios.toggleInput;
  const formContent = document.querySelector('.ui-hidefolios');
  const pagesInput = document.querySelector('#hidefolios-pages');
  const applyButton = document.querySelector('#hidefolios-apply');
  
  // Restaurer l'état d'affichage du formulaire
  const isFormVisible = localStorage.getItem('hideFoliosFormVisible') === 'true';
  toggleInput.checked = isFormVisible;
  
  if (formContent) {
    formContent.style.display = isFormVisible ? 'block' : 'none';
  }
  
  // Toggle pour afficher/masquer le formulaire
  function toggleFormVisibility() {
    const isVisible = toggleInput.checked;
    localStorage.setItem('hideFoliosFormVisible', isVisible);
    
    if (formContent) {
      formContent.style.display = isVisible ? 'block' : 'none';
    }
  }
  
  toggleInput.addEventListener("input", toggleFormVisibility);
  
  // Charger les pages depuis hideFolios-data.js
  if (pagesInput) {
    pagesInput.value = hideFoliosData.pages || '';
  }
  
  // Créer ou mettre à jour le lien de téléchargement
  function createDownloadLink(dataBlob) {
    const existingLink = document.getElementById('hidefolios-download');
    
    if (existingLink) {
      existingLink.href = URL.createObjectURL(dataBlob);
    } else {
      let link = document.createElement('a');
      link.id = 'hidefolios-download';
      link.classList = 'download-link';
      link.href = URL.createObjectURL(dataBlob);
      link.download = 'hideFolios-data.js';
      link.textContent = '📥 Télécharger hideFolios-data.js';
      
      let div = document.createElement('div');
      div.classList = 'download-group';
      div.append(link);
      
      document.querySelector('.ui-hidefolios').appendChild(div);
    }
  }
  
  // Sauvegarder dans hideFolios-data.js
  function save() {
    const config = {
      version: "1.0",
      pages: pagesInput.value
    };
    
    // Créer le contenu du fichier
    const fileContent = `/**
 * @name Hide Folios Data
 * @file Configuration pour le masquage des folios
 */

export default ${JSON.stringify(config, null, 2)};
`;
    
    // Créer un Blob
    const dataBlob = new Blob([fileContent], { type: 'text/javascript' });
    
    // Créer/mettre à jour le lien de téléchargement
    createDownloadLink(dataBlob);
  }
  
  // Appliquer : sauvegarder
  function applyPages() {
    save();
    
    // Message d'information
    alert('📥 Fichier prêt au téléchargement !\n\n1. Cliquez sur le lien "Télécharger hideFolios-data.js"\n2. Copiez le fichier dans :\n   _11ty/csspageweaver/plugins/hideFolios/\n3. Écrasez l\'ancien fichier\n4. Rechargez la page');
  }
  
  // Validation sur Enter
  if (pagesInput) {
    pagesInput.addEventListener("keydown", (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPages();
      }
    });
  }
  
  // Validation sur clic bouton
  if (applyButton) {
    applyButton.addEventListener("click", applyPages);
  }
}