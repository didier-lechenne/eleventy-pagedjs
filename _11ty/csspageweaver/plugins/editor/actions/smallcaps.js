function toggleSmallCaps() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (selectedText.length === 0) return;

  let container = range.commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }

  if (container.classList && container.classList.contains("small-caps")) {
    // Supprimer les petites capitales
    const parent = container.parentNode;
    while (container.firstChild) {
      parent.insertBefore(container.firstChild, container);
    }
    parent.removeChild(container);
  } else {
    // Appliquer les petites capitales
    const span = document.createElement("span");
    span.className = "small-caps editor-add";
    span.setAttribute("data-timestamp", Date.now());
    
    try {
      range.surroundContents(span);
    } catch (e) {
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    }
  }
}

export function smallcaps(actionRegistry) {
  actionRegistry.add('smallcaps', {
    type: "toggle",
    icon: "ᴀᴀ",
    title: "Petites capitales",
    execute: () => toggleSmallCaps(),
    isActive: (element) => {
      let current = element;
      while (current && current !== document.body) {
        if (current.tagName === "SPAN" && current.classList.contains("small-caps")) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    },
  });
}