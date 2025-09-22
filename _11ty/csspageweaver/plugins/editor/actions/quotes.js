import { UNICODE_CHARS } from "../unicode.js";

function toggleFrenchQuotes() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const text = range.toString();

  if (text) {
    range.deleteContents();
    const timestamp = Date.now();
    const fragment = document.createDocumentFragment();

    const openQuoteSpan = document.createElement("span");
    openQuoteSpan.className = "french-quote-open editor-add";
    openQuoteSpan.setAttribute("data-timestamp", timestamp);
    openQuoteSpan.textContent = UNICODE_CHARS.LAQUO;

    const openSpaceSpan = document.createElement("span");
    openSpaceSpan.className = "i_space no-break-narrow-space editor-add";
    openSpaceSpan.setAttribute("data-timestamp", timestamp);
    openSpaceSpan.textContent = UNICODE_CHARS.NO_BREAK_THIN_SPACE;

    const textNode = document.createTextNode(text);

    const closeSpaceSpan = document.createElement("span");
    closeSpaceSpan.className = "i_space no-break-narrow-space editor-add";
    closeSpaceSpan.setAttribute("data-timestamp", timestamp);
    closeSpaceSpan.textContent = UNICODE_CHARS.NO_BREAK_THIN_SPACE;

    const closeQuoteSpan = document.createElement("span");
    closeQuoteSpan.className = "french-quote-close editor-add";
    closeQuoteSpan.setAttribute("data-timestamp", timestamp);
    closeQuoteSpan.textContent = UNICODE_CHARS.RAQUO;

    fragment.appendChild(openQuoteSpan);
    fragment.appendChild(openSpaceSpan);
    fragment.appendChild(textNode);
    fragment.appendChild(closeSpaceSpan);
    fragment.appendChild(closeQuoteSpan);

    range.insertNode(fragment);
  }
}

function toggleEnglishQuotes() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const text = range.toString();

  if (text) {
    range.deleteContents();
    const timestamp = Date.now();
    const fragment = document.createDocumentFragment();

    const openQuoteSpan = document.createElement("span");
    openQuoteSpan.className = "english-quote-open editor-add";
    openQuoteSpan.setAttribute("data-timestamp", timestamp);
    openQuoteSpan.textContent = UNICODE_CHARS.LDQUO;

    const textNode = document.createTextNode(text);

    const closeQuoteSpan = document.createElement("span");
    closeQuoteSpan.className = "english-quote-close editor-add";
    closeQuoteSpan.setAttribute("data-timestamp", timestamp);
    closeQuoteSpan.textContent = UNICODE_CHARS.RDQUO;

    fragment.appendChild(openQuoteSpan);
    fragment.appendChild(textNode);
    fragment.appendChild(closeQuoteSpan);

    range.insertNode(fragment);
  }
}

export function quotes(actionRegistry) {
  actionRegistry.add('quotes', {
    type: 'toggle-select',
    icon: `${UNICODE_CHARS.LAQUO} ⌄`,
    title: 'Guillemets',
    options: [
      {
        value: 'french',
        label: `${UNICODE_CHARS.LAQUO} Français ${UNICODE_CHARS.RAQUO}`,
        execute: () => toggleFrenchQuotes(),
        isActive: (element) => {
          const parent = element.closest("*");
          if (!parent) return false;
          return parent.querySelector(".french-quote-open") !== null;
        }
      },
      {
        value: 'english', 
        label: `${UNICODE_CHARS.LDQUO} Anglais ${UNICODE_CHARS.RDQUO}`,
        execute: () => toggleEnglishQuotes(),
        isActive: (element) => {
          const parent = element.closest("*");
          if (!parent) return false;
          return parent.querySelector(".english-quote-open") !== null;
        }
      }
    ]
  });
}