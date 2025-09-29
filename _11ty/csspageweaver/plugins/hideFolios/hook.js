/**
 * @name Hide Folios Hook
 * @file Hook PagedJS pour masquer les folios
 */

import { Handler } from "../../../lib/paged.esm.js";
import hideFoliosData from './hideFolios-data.js';

export default class HideFolios extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.selectedPages = new Set();
  }

  beforeParsed(content) {
    // Lire depuis hideFolios-data.js
    const pages = hideFoliosData.pages || '';
    
    if (pages) {
      this.selectedPages = this.parsePages(pages);
      console.log('Hide Folios: Pages masquées -', Array.from(this.selectedPages).join(', '));
    }
  }

  afterPageLayout(pageElement, page, breakToken) {
    const pageNumber = page.position + 1;
    
    if (this.selectedPages.has(pageNumber)) {
      pageElement.style.setProperty('--folio', 'none', 'important');
    }
  }

  parsePages(input) {
    const pages = new Set();
    const parts = input.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        // Plage : "1-5"
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      } else {
        // Page unique
        const num = parseInt(part);
        if (!isNaN(num) && num > 0) {
          pages.add(num);
        }
      }
    });
    
    return pages;
  }
}