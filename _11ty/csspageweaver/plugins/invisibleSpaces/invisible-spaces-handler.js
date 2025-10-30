import { Handler } from "../../../lib/paged.esm.js";

class InvisibleSpacesHandler extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    window.pagedChunker = chunker;
    window.pagedCaller = caller;
    this.isWrapped = false;
  }

  afterRendered(pages) {
    const isEnabled = document.body.getAttribute('data-invisible-spaces') === 'true';
    
    // Ne modifier le DOM que si l'état change
    if (isEnabled && !this.isWrapped) {
      this.wrapAll();
      this.isWrapped = true;
    } else if (!isEnabled && this.isWrapped) {
      this.unwrapAll();
      this.isWrapped = false;
    }
  }

  wrapAll() {
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, ol, td, th, blokquote, .footnote');
    elements.forEach(el => this.wrapCharacters(el));
  }

  unwrapAll() {
    const spans = document.querySelectorAll('.invisible-nbsp, .invisible-narrow-nbsp, .invisible-thin, .invisible-hair');
    spans.forEach(span => span.replaceWith(document.createTextNode(span.textContent)));
  }

  wrapCharacters(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) textNodes.push(node);

    textNodes.forEach(textNode => {
      const parts = textNode.nodeValue.split(/(\u00A0|\u202F|\u2009|\u200A)/g);
      
      if (parts.length > 1) {
        const fragment = document.createDocumentFragment();
        
        parts.forEach(part => {
          if (part === '\u00A0') {
            const span = document.createElement('span');
            span.className = 'invisible-nbsp';
            span.setAttribute('data-char', '\u00A0');
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part === '\u202F') {
            const span = document.createElement('span');
            span.className = 'invisible-narrow-nbsp';
            span.setAttribute('data-char', '\u202F');
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part === '\u2009') {
            const span = document.createElement('span');
            span.className = 'invisible-thin';
            span.setAttribute('data-char', '\u2009');
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part === '\u200A') {
            const span = document.createElement('span');
            span.className = 'invisible-hair';
            span.setAttribute('data-char', '\u200A');
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        
        textNode.replaceWith(fragment);
      }
    });
  }
}

export default InvisibleSpacesHandler;