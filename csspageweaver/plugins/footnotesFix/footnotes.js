/**
 * @name Footnotes
 * @file Reset the way footnote are counted
 * @author Julie Blanc <contact@julie-blanc.fr>
 * @see { @link https://gitlab.com/csspageweaver/plugins/footnotesFix/ }
 */

import { Handler } from "../../../lib/paged.esm.js";

export default class footnotes extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.parameters = cssPageWeaver.features.footnotesFix.parameters;
    this.reset = this.parameters?.reset ; 
    this.counter = 0;
    this.selector = this.parameters?.selector || ".footnote";
  }

  beforeParsed(content) {
   

    let notes = content.querySelectorAll(this.selector);
    notes.forEach(function (note, index) {
      note.classList.add("pagedjs_footnote");
    });


   
    if(this.reset){
      let elems = content.querySelectorAll(this.reset);        
      elems.forEach(function (elem, index) {
          var span = document.createElement('span');
          span.classList.add("reset-fix-footnote");
          span.style.position = "absolute";
          elem.insertBefore(span, elem.firstChild);
      });
    }else{
      console.log("[footnotesFix] no reset")
    }
   
  }


afterPageLayout(pageElement, page, breakToken){

  // Toujours numéroter, même sans reset
  let footnotes = pageElement.querySelectorAll(".pagedjs_footnote_content [data-note]");
  let callnotes = pageElement.querySelectorAll('a.pagedjs_footnote');
  
  // Reset si configuré
  if(this.reset){
    if(this.reset === "page"){
      this.counter = 0;  
    }
    let newchapter = pageElement.querySelector('.reset-fix-footnote');
    if(newchapter){
      this.counter = 0;        
    }
  }

  callnotes.forEach((call, index) => {
    this.counter = this.counter + 1;
    let num = this.counter - 1;

    // Ajouter data-counter-note sur l'appel
    call.setAttribute('data-counter-note', this.counter);


    // Marker
    let footnote = footnotes[index];
    if(footnote) {
      footnote.setAttribute('data-counter-note', this.counter);
      footnote.style.counterReset = "footnote-marker " + num;
    }
  });
}



}