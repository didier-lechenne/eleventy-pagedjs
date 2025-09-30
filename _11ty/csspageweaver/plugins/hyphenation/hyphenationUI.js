/**
 * @name Hyphenation UI
 * @description Gère l'interface utilisateur du plugin de césures
 */

export default function hyphenationUI() {
  const toggleInput = cssPageWeaver.ui.hyphenation?.toggleInput;
  const formContent = document.querySelector('.ui-hyphenation');
  
  if (!toggleInput || !formContent) return;
  
  // Restaurer l'état d'affichage du formulaire
  const isFormVisible = localStorage.getItem('hyphenationFormVisible') === 'true';
  toggleInput.checked = isFormVisible;
  formContent.style.display = isFormVisible ? 'block' : 'none';
  
  // Toggle pour afficher/masquer le formulaire
  function toggleFormVisibility() {
    const isVisible = toggleInput.checked;
    localStorage.setItem('hyphenationFormVisible', isVisible);
    formContent.style.display = isVisible ? 'block' : 'none';
  }
  
  toggleInput.addEventListener("input", toggleFormVisibility);
  
  // Sauvegarder l'état des checkboxes
  const mainCheckbox = document.querySelector('#hyphen-main');
  const footnotesCheckbox = document.querySelector('#hyphen-footnotes');
  
  if (mainCheckbox) {
    mainCheckbox.checked = localStorage.getItem('hyphenMain') !== 'false';
    mainCheckbox.addEventListener('change', () => {
      localStorage.setItem('hyphenMain', mainCheckbox.checked);
    });
  }
  
  if (footnotesCheckbox) {
    footnotesCheckbox.checked = localStorage.getItem('hyphenFootnotes') !== 'false';
    footnotesCheckbox.addEventListener('change', () => {
      localStorage.setItem('hyphenFootnotes', footnotesCheckbox.checked);
    });
  }
}