import { UNICODE_CHARS } from "../unicode.js";

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
    icon: UNICODE_CHARS.A_GRAVE + " ⌄",
    title: "Capitales accentuées",
    options: [
      { value: "A_grave", label: UNICODE_CHARS.A_GRAVE, char: UNICODE_CHARS.A_GRAVE },
      { value: "A_acute", label: UNICODE_CHARS.A_ACUTE, char: UNICODE_CHARS.A_ACUTE },
      { value: "A_circ", label: UNICODE_CHARS.A_CIRC, char: UNICODE_CHARS.A_CIRC },
      { value: "A_uml", label: UNICODE_CHARS.A_UML, char: UNICODE_CHARS.A_UML },
      { value: "C_cedil", label: UNICODE_CHARS.C_CEDIL, char: UNICODE_CHARS.C_CEDIL },
      { value: "E_grave", label: UNICODE_CHARS.E_GRAVE, char: UNICODE_CHARS.E_GRAVE },
      { value: "E_acute", label: UNICODE_CHARS.E_ACUTE, char: UNICODE_CHARS.E_ACUTE },
      { value: "E_circ", label: UNICODE_CHARS.E_CIRC, char: UNICODE_CHARS.E_CIRC },
      { value: "E_uml", label: UNICODE_CHARS.E_UML, char: UNICODE_CHARS.E_UML },
      { value: "I_grave", label: UNICODE_CHARS.I_GRAVE, char: UNICODE_CHARS.I_GRAVE },
      { value: "I_acute", label: UNICODE_CHARS.I_ACUTE, char: UNICODE_CHARS.I_ACUTE },
      { value: "I_circ", label: UNICODE_CHARS.I_CIRC, char: UNICODE_CHARS.I_CIRC },
      { value: "I_uml", label: UNICODE_CHARS.I_UML, char: UNICODE_CHARS.I_UML },
      { value: "O_grave", label: UNICODE_CHARS.O_GRAVE, char: UNICODE_CHARS.O_GRAVE },
      { value: "O_acute", label: UNICODE_CHARS.O_ACUTE, char: UNICODE_CHARS.O_ACUTE },
      { value: "O_circ", label: UNICODE_CHARS.O_CIRC, char: UNICODE_CHARS.O_CIRC },
      { value: "O_uml", label: UNICODE_CHARS.O_UML, char: UNICODE_CHARS.O_UML },
      { value: "U_grave", label: UNICODE_CHARS.U_GRAVE, char: UNICODE_CHARS.U_GRAVE },
      { value: "U_acute", label: UNICODE_CHARS.U_ACUTE, char: UNICODE_CHARS.U_ACUTE },
      { value: "U_circ", label: UNICODE_CHARS.U_CIRC, char: UNICODE_CHARS.U_CIRC },
      { value: "U_uml", label: UNICODE_CHARS.U_UML, char: UNICODE_CHARS.U_UML },
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