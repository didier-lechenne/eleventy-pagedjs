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

export function medianPoint(actionRegistry) {
  actionRegistry.add("median-point", {
    type: "insert",
    icon: UNICODE_CHARS.MIDDLE_DOT,
    title: "Point médian",
    execute: () => insertText(UNICODE_CHARS.MIDDLE_DOT),
  });
}