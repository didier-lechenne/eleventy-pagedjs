import { Handler } from "../../../lib/paged.esm.js";

export default class Hyphenation extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content) {
    // Attendre que l'UI soit chargée
    window.addEventListener("beforeprint", () => {
      this.applyHyphenation();
    });
  }

  applyHyphenation() {
    const mainParagraphs = document.querySelector('#hyphen-main')?.checked || false;
    const footnotes = document.querySelector('#hyphen-footnotes')?.checked || false;
    
    if (!mainParagraphs && !footnotes) {
      console.log('Hyphenation: désactivée');
      return;
    }

    const selectors = {};
    if (mainParagraphs) {
      selectors["main p"] = {};
      selectors["blockquote"] = {};
    }
    if (footnotes) {
      selectors[".pagedjs_footnote_content"] = {};
    }

    window.Hyphenopoly = {
      require: {"fr": "FORCEHYPHENOPOLY"},
      setup: {
        selectors: selectors,
        minWordLength: 6,
        leftmin: 3,
        rightmin: 2
      }
    };

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/hyphenopoly@5.3.0/min/Hyphenopoly_Loader.js';
    document.head.appendChild(script);
    
    console.log('✓ Hyphenation:', selectors);
  }
}