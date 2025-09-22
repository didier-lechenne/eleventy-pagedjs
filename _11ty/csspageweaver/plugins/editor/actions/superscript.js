function toggleSuperscript() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();
  if (selectedText.length === 0) return;

  const parentElement = range.commonAncestorContainer.parentElement;
  if (parentElement && parentElement.tagName.toLowerCase() === 'sup') {
    // Supprimer l'exposant
    const grandParent = parentElement.parentNode;
    while (parentElement.firstChild) {
      grandParent.insertBefore(parentElement.firstChild, parentElement);
    }
    grandParent.removeChild(parentElement);
  } else {
    // Appliquer l'exposant
    const sup = document.createElement('sup');
    sup.className = 'editor-add';
    sup.setAttribute('data-timestamp', Date.now());
    
    try {
      range.surroundContents(sup);
    } catch (e) {
      sup.textContent = selectedText;
      range.deleteContents();
      range.insertNode(sup);
    }
  }
}

export function superscript(actionRegistry) {
  actionRegistry.add('superscript', {
    type: "toggle",
    icon: "x²",
    title: "Exposant",
    execute: () => toggleSuperscript(),
    isActive: (element) => element.closest("sup") !== null,
  });
}