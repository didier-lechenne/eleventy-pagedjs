/**
 * @name Hide Folios
 * @file Masque les numéros de page (folios) sur des pages spécifiques
 * @author Didier Lechenne
 */

import { Handler, registerHandlers } from "../../../lib/paged.esm.js";

export default class HideFolios extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.parameters = cssPageWeaver.features.hideFolios.parameters;
    this.pages = this.parameters?.pages || [];
  }

  afterPageLayout(pageElement, page, breakToken) {
    const pageNumber = page.position + 1;
    
    // Vérifier si cette page est dans la liste
    if (this.pages.includes(pageNumber)) {
      pageElement.style.setProperty('--folio', 'none', 'important');
      // console.log(`[hideFolios] Page ${pageNumber}: folio masqué`);
    }
  }

  
}

registerHandlers(HideFolios);