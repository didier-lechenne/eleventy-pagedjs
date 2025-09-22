function createAndInsertElement(tagName, className = null) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.classList.add("editor-add");
  element.setAttribute("data-timestamp", Date.now());

  range.insertNode(element);
  range.setStartAfter(element);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function breaks(actionRegistry) {
  actionRegistry.add("breaks", {
    type: "toggle-select",
    icon: "⤋ ⌄",
    title: "Sauts",
    options: [
      {
        value: "line",
        label: "↵ Saut de ligne",
        execute: () => createAndInsertElement("br"),
      },
      {
        value: "column", 
        label: "⤋ Saut de colonne",
        execute: () => createAndInsertElement("hr", "breakcolumn"),
      },
      {
        value: "page",
        label: "⤓ Saut de page", 
        execute: () => createAndInsertElement("br", "breakpage"),
      },
    ],
  });
}