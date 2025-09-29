/**
 * @name Hide Folios Hook
 * @file Hook PagedJS pour masquer les folios
 */

import { Handler } from "../../../lib/paged.esm.js";

export default class HideFolios extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.selectedPages = new Set();
    this.isActive = false;
  }

  beforeParsed(content) {
    const fileTitle = cssPageWeaver.docTitle;
    
    // Vérifier si activé
    this.isActive = localStorage.getItem('hideFolios_' + fileTitle) === 'true';
    
    if (!this.isActive) return;
    
    // Récupérer les pages depuis localStorage OU paramètres
    const savedPages = localStorage.getItem('hideFoliosPages_' + fileTitle);
    const parameters = cssPageWeaver.features.hideFolios?.parameters || {};
    const pages = savedPages || parameters.pages || '';
    
    if (pages) {
      this.selectedPages = this.parsePages(pages);
    }
  }

  afterPageLayout(pageElement, page, breakToken) {
    if (!this.isActive) return;
    
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
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) pages.add(num);
      }
    });
    
    return pages;
  }
}