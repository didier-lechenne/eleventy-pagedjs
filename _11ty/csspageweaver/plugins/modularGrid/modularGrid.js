/**
 * @name Modular Grid
 * @author Based on Full Page by Julie Blanc <contact@julie-blanc.fr>
 * @see { @link https://gitlab.com/csspageweaver/plugins/modularGrid }
 */
import { Handler } from "../../../lib/paged.esm.js";

export default class modularGrid extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.selectorModularPage = new Set();
    this.selectorModularRight = new Set();
    this.selectorModularLeft = new Set();
    this.specificPage = new Set();
    this.specificPageClone = new Set();
  }

  onDeclaration(declaration, dItem, dList, rule) {
    if (declaration.property == "--pagedjs-modular-grid") {
      let selector = csstree.generate(rule.ruleNode.prelude);
      if (declaration.value.value.includes("page")) {
        this.selectorModularPage.add(selector);
      } else if (declaration.value.value.includes("right")) {
        this.selectorModularRight.add(selector);
      } else if (declaration.value.value.includes("left")) {
        this.selectorModularLeft.add(selector);
      } else {
        let obj = { page: declaration.value.value, elem: selector };
        this.specificPage.add(JSON.stringify(obj));
      }
    }
  }

  afterParsed(parsed) {
    console.log("MODULAR GRID loaded");
 
    for (let item of this.selectorModularPage) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_modular-page-elem");
      }
    }
    for (let item of this.selectorModularLeft) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_modular-page-left-elem");
      }
    }
    for (let item of this.selectorModularRight) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_modular-page-right-elem");
      }
    }

    const inlineElements = parsed.querySelectorAll('[style*="--pagedjs-modular-grid"]');
    inlineElements.forEach((element) => {
      const style = element.getAttribute('style');
      const match = style.match(/--pagedjs-modular-grid:\s*([^;]+)/);
      
      if (match) {
        const value = match[1].trim();
        
        if (value.includes("page")) {
          element.classList.add("pagedjs_modular-page-elem");
        } else if (value.includes("right")) {
          element.classList.add("pagedjs_modular-page-right-elem");
        } else if (value.includes("left")) {
          element.classList.add("pagedjs_modular-page-left-elem");
        } else if (value.match(/^\d+$/)) {
          element.classList.add("pagedjs_modular-page-specific");
          const obj = { page: value, elem: `#${element.id}` };
          this.specificPage.add(JSON.stringify(obj));
          
          const clone = element.cloneNode(true);
          obj.elemClone = clone.outerHTML;
          element.remove();
          this.specificPageClone.add(JSON.stringify(obj));
        }
      }
    });

    this.specificPage.forEach(entry => {
      const obj = JSON.parse(entry);
      const elements = parsed.querySelectorAll(obj.elem);
      if (elements.length > 0) {
        elements[0].classList.add("pagedjs_modular-page-specific");
        const clone = elements[0].cloneNode(true); 
        obj.elemClone = clone.outerHTML; 
        elements[0].remove();
      }
      this.specificPageClone.add(JSON.stringify(obj));
    });
  }

  afterPageLayout(pageElement, page, breakToken, chunker) {
    if (pageElement.classList.contains("pagedjs_first_page")) {
      let body = document.getElementsByTagName("body")[0];
      let style = window.getComputedStyle(body);
      let fold = style.getPropertyValue('--pagedjs-fold');
      if (!fold) {
        body.style.setProperty('--pagedjs-fold', '0mm')
      }
    }

    // Chercher les éléments modulaires dans cette page
    let modularElement = pageElement.querySelector('.pagedjs_modular-page-elem');
    let modularLeftElement = pageElement.querySelector('.pagedjs_modular-page-left-elem');
    let modularRightElement = pageElement.querySelector('.pagedjs_modular-page-right-elem');

    // MODULAR PAGE
    if (modularElement) {
      let pageContent = pageElement.querySelector('.pagedjs_page_content');
      if (pageContent) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_modular-page_content");
        container.appendChild(pageContent.cloneNode(true));
        let newPage = chunker.addPage();

        newPage.element
          .querySelector(".pagedjs_page_content")
          .replaceWith(container);
        newPage.element.classList.add("pagedjs_page_modularPage");
        
        pageContent.innerHTML = '';
      }
    }

    // MODULAR LEFT PAGE
    if (modularLeftElement && page.element.classList.contains("pagedjs_right_page")) {
      let pageContent = pageElement.querySelector('.pagedjs_page_content');
      if (pageContent) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_modular-page_content");
        container.appendChild(pageContent.cloneNode(true));
        let newPage = chunker.addPage();

        newPage.element
          .querySelector(".pagedjs_page_content")
          .replaceWith(container);
        newPage.element.classList.add("pagedjs_page_modularPage");
        
        pageContent.innerHTML = '';
      }
    }

    // MODULAR RIGHT PAGE
    if (modularRightElement && page.element.classList.contains("pagedjs_left_page")) {
      let pageContent = pageElement.querySelector('.pagedjs_page_content');
      if (pageContent) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_modular-page_content");
        container.appendChild(pageContent.cloneNode(true));
        let newPage = chunker.addPage();

        newPage.element
          .querySelector(".pagedjs_page_content")
          .replaceWith(container);
        newPage.element.classList.add("pagedjs_page_modularPage");
        
        pageContent.innerHTML = '';
      }
    }

    // SPECIFIC PAGE
    let pageNum = pageElement.id.split("page-")[1];
    pageNum = parseInt(pageNum);

    this.specificPageClone.forEach((entry) => {
      const obj = JSON.parse(entry);
      let targetedPage = obj.page;
      let prevPage = parseInt(targetedPage) - 1;
      let elem = obj.elemClone;

      if (targetedPage == 1 && pageNum == 1) {
        let section = pageElement.querySelector("section");
        let container = document.createElement("div");
        container.classList.add("pagedjs_modular-page_content");
        container.classList.add("cover");
        container.innerHTML = elem;

        if (section) {
          section.replaceWith(container);
        } else {
          pageElement.querySelector(".pagedjs_page_content").appendChild(container);
        }
        pageElement.classList.add("pagedjs_page_modularContent");
      } else if (prevPage == pageNum) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_modular-page_content");
        container.innerHTML = elem;
        let fullContent = chunker.addPage();

        fullContent.element
          .querySelector(".pagedjs_page_content")
          .insertAdjacentElement("afterbegin", container);
        fullContent.element.classList.add("pagedjs_page_modularContent");
      }
    });
  }
}