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

export function emDash(actionRegistry) {
  actionRegistry.add("em-dash", {
    type: "insert",
    icon: "—",
    title: "Tiret cadratin",
    execute: () => insertText(UNICODE_CHARS.EM_DASH),
  });
}