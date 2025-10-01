import { UNICODE_CHARS } from "../unicode.js";

function insertSpace(className, content) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.className = `i_space ${className} editor-add`;
  span.setAttribute("data-timestamp", Date.now());
  span.textContent = content;

  if (!range.collapsed) range.deleteContents();
  range.insertNode(span);
  range.setStartAfter(span);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function nnbsp(actionRegistry) {
  actionRegistry.add("nnbsp", {
    type: "insert",
    icon: "␣",
    title: "Espace insécable fine",
    execute: () => insertSpace("no-break-narrow-space", UNICODE_CHARS.NO_BREAK_THIN_SPACE),
  });
}