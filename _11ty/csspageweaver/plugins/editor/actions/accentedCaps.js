function insertText(text) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.className = "editor-add";
  span.setAttribute("data-timestamp", Date.now());
  span.textContent = text;

  range.deleteContents();
  range.insertNode(span);
  range.setStartAfter(span);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function accentedCaps(actionRegistry) {
  actionRegistry.add("accented-caps", {
    type: "select",
    icon: "À ⌄",
    title: "Capitales accentuées",
    options: [
      { value: "A_grave", label: "À - A accent grave", char: "À" },
      { value: "A_acute", label: "Á - A accent aigu", char: "Á" },
      { value: "A_circ", label: "Â - A circonflexe", char: "Â" },
      { value: "A_uml", label: "Ä - A tréma", char: "Ä" },
      { value: "C_cedil", label: "Ç - C cédille", char: "Ç" },
      { value: "E_grave", label: "È - E accent grave", char: "È" },
      { value: "E_acute", label: "É - E accent aigu", char: "É" },
      { value: "E_circ", label: "Ê - E circonflexe", char: "Ê" },
      { value: "E_uml", label: "Ë - E tréma", char: "Ë" },
      { value: "I_grave", label: "Ì - I accent grave", char: "Ì" },
      { value: "I_acute", label: "Í - I accent aigu", char: "Í" },
      { value: "I_circ", label: "Î - I circonflexe", char: "Î" },
      { value: "I_uml", label: "Ï - I tréma", char: "Ï" },
      { value: "O_grave", label: "Ò - O accent grave", char: "Ò" },
      { value: "O_acute", label: "Ó - O accent aigu", char: "Ó" },
      { value: "O_circ", label: "Ô - O circonflexe", char: "Ô" },
      { value: "O_uml", label: "Ö - O tréma", char: "Ö" },
      { value: "U_grave", label: "Ù - U accent grave", char: "Ù" },
      { value: "U_acute", label: "Ú - U accent aigu", char: "Ú" },
      { value: "U_circ", label: "Û - U circonflexe", char: "Û" },
      { value: "U_uml", label: "Ü - U tréma", char: "Ü" },
    ],
    execute: (editor, value) => {
      const action = actionRegistry.get("accented-caps");
      const option = action.options.find((opt) => opt.value === value);
      if (option?.char) {
        insertText(option.char);
      }
    },
  });
}