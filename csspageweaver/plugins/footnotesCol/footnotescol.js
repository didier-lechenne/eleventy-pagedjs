/**
 * @name Footnotes Columns
 * @file Applique --g-column-count:1 sur les notes de bas de page pour des pages spécifiques
 * @author Didier Lechenne
 */

import { Handler, registerHandlers } from "../../../lib/paged.esm.js";

export default class FootnotesCol extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.parameters = cssPageWeaver.features.footnotesCol.parameters;
    this.pages = this.parameters?.pages || [];
  }

  afterPageLayout(pageElement, page) {
    // Récupérer le numéro de la page courante
    const pageNumber = page.position + 1;
    
    // Vérifier si cette page est dans la liste des pages configurées
    if (this.pages.includes(pageNumber)) {
      // Trouver le conteneur de notes de bas de page
      const footnoteContent = pageElement.querySelector('.pagedjs_footnote_inner_content');
      
      if (footnoteContent) {
        // Appliquer la custom property --g-column-count: 1
        footnoteContent.style.setProperty('--g-column-count', '1');
        // console.log(`[footnotesCol] Page ${pageNumber}: --g-column-count: 1 appliqué`);
      }
    }
  }
}

registerHandlers(FootnotesCol);