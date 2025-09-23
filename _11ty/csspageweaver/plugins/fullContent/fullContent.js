/**
 * @name Full Content
 * @author Julie Blanc <contact@julie-blanc.fr>
 * @author Didier Lechenne <didier@lechenne.fr>
 * Plugin fullContent basé sur fullPage avec support inline et noms uniques
 */
import { Handler } from "../../../lib/paged.esm.js";

let bleedFull = "6mm";

export default class fullContent extends Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.selectorFullSpread = new Set();
    this.fullSpreadEls = new Set();
    this.selectorFullPage = new Set();
    this.fullPageEls = new Set();
    this.selectorFullRight = new Set();
    this.fullRightEls = new Set();
    this.selectorFullLeft = new Set();
    this.fullLeftEls = new Set();
    this.usedPagedEls = new Set();
    this.specificPage = new Set();
    this.specificPageClone = new Set();
  }

  onDeclaration(declaration, dItem, dList, rule) {
    if (declaration.property == "--pagedjs-full-content") {
      let selector = csstree.generate(rule.ruleNode.prelude);
      if (declaration.value.value.includes("page")) {
        this.selectorFullPage.add(selector);
      } else if (declaration.value.value.includes("spread")) {
        this.selectorFullSpread.add(selector);
      } else if (declaration.value.value.includes("right")) {
        this.selectorFullRight.add(selector);
      } else if (declaration.value.value.includes("left")) {
        this.selectorFullLeft.add(selector);
      } else {
        let obj = { page: declaration.value.value, elem: selector };
        this.specificPage.add(JSON.stringify(obj));
      }
    }
  }

  afterParsed(parsed) {
    console.log("FULL CONTENT loaded");

   
    for (let item of this.selectorFullPage) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-content-elem"); // ← NOUVEAU NOM
      }
    }
    for (let item of this.selectorFullSpread) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-content-spread-elem"); // ← NOUVEAU NOM
      }
    }
    for (let item of this.selectorFullLeft) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-content-left-elem"); // ← NOUVEAU NOM
      }
    }
    for (let item of this.selectorFullRight) {
      let elems = parsed.querySelectorAll(item);
      for (let elem of elems) {
        elem.classList.add("pagedjs_full-content-right-elem"); // ← NOUVEAU NOM
      }
    }

    this.specificPage.forEach((entry) => {
      const obj = JSON.parse(entry);
      const elements = parsed.querySelectorAll(obj.elem);
      if (elements.length > 0) {
        elements[0].classList.add("pagedjs_full-content-specific"); // ← NOUVEAU NOM
        const clone = elements[0].cloneNode(true);
        obj.elemClone = clone.outerHTML;
        elements[0].remove();
      }
      this.specificPageClone.add(JSON.stringify(obj));
    });

    // Support des styles inline avec nouveaux noms
    const inlineElements = parsed.querySelectorAll('[style*="--pagedjs-full-content"]');
    inlineElements.forEach((element) => {
      const style = element.getAttribute("style");
      const match = style.match(/--pagedjs-full-content:\s*([^;]+)/);

      if (match) {
        const value = match[1].trim();
        console.log("Valeur inline trouvée:", value);

        if (value.includes("page")) {
          element.classList.add("pagedjs_full-content-elem"); // ← NOUVEAU NOM
        } else if (value.includes("spread")) {
          element.classList.add("pagedjs_full-content-spread-elem"); // ← NOUVEAU NOM
        } else if (value.includes("right")) {
          element.classList.add("pagedjs_full-content-right-elem"); // ← NOUVEAU NOM
        } else if (value.includes("left")) {
          element.classList.add("pagedjs_full-content-left-elem"); // ← NOUVEAU NOM
        } else {
          element.classList.add("pagedjs_full-content-specific"); // ← NOUVEAU NOM
          const obj = { page: value, elem: "#" + element.id };
          const clone = element.cloneNode(true);
          obj.elemClone = clone.outerHTML;
          element.remove();
          this.specificPageClone.add(JSON.stringify(obj));
        }
      }
    });
  }

  renderNode(clone, node) {
    // CHANGEMENT: Utilisation des nouveaux noms de classes
    if (node.nodeType == 1 && node.classList.contains("pagedjs_full-content-spread-elem")) {
      this.fullSpreadEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    }

    if (node.nodeType == 1 && node.classList.contains("pagedjs_full-content-left-elem")) {
      this.fullLeftEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    } else if (node.nodeType == 1 && node.classList.contains("pagedjs_full-content-right-elem")) {
      this.fullRightEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    } else if (node.nodeType == 1 && node.classList.contains("pagedjs_full-content-elem")) {
      this.fullPageEls.add(node);
      this.usedPagedEls.add(node);
      clone.style.display = "none";
    }
  }

  afterPageLayout(pageElement, page, breakToken, chunker) {
    if (page.id == "page-1") {
      let allPages = document.querySelector(".pagedjs_pages");
      allPages.style.setProperty("--bleed-images", bleedFull);
    }

    if (pageElement.classList.contains("pagedjs_first_page")) {
      let body = document.getElementsByTagName("body")[0];
      let style = window.getComputedStyle(body);
      let fold = style.getPropertyValue("--pagedjs-fold");
      if (!fold) {
        body.style.setProperty("--pagedjs-fold", "0mm");
      }
    }

    // FULL SPREAD avec containers uniques
    for (let img of this.fullSpreadEls) {
      if (page.element.classList.contains("pagedjs_right_page")) {
        let imgLeft;
        let imgRight;

        if (img.nodeName == "IMG") {
          let containerLeft = document.createElement("div");
          containerLeft.classList.add("pagedjs_full-content-spread_container"); // ← NOUVEAU NOM
          let containerLeftInside = document.createElement("div");
          containerLeftInside.classList.add("pagedjs_full-content-spread_content"); // ← NOUVEAU NOM
          containerLeft.appendChild(containerLeftInside).appendChild(img);
          imgLeft = containerLeft;

          let containerRight = document.createElement("div");
          containerRight.classList.add("pagedjs_full-content-spread_container"); // ← NOUVEAU NOM
          let containerRightInside = document.createElement("div");
          containerRightInside.classList.add("pagedjs_full-content-spread_content"); // ← NOUVEAU NOM
          containerRight.appendChild(containerRightInside).appendChild(img.cloneNode(true));
          imgRight = containerRight;
        } else {
          let containerLeft = document.createElement("div");
          containerLeft.classList.add("pagedjs_full-content-spread_container"); // ← NOUVEAU NOM
          img.classList.add("pagedjs_full-content-spread_content"); // ← NOUVEAU NOM
          containerLeft.appendChild(img);
          imgLeft = containerLeft;
          
          let containerRight = document.createElement("div");
          containerRight.classList.add("pagedjs_full-content-spread_container"); // ← NOUVEAU NOM
          img.classList.add("pagedjs_full-content-spread_content"); // ← NOUVEAU NOM
          containerRight.appendChild(img.cloneNode(true));
          imgRight = containerRight;
        }

        let fullPage = chunker.addPage();
        fullPage.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", imgLeft);
        fullPage.element.classList.add("pagedjs_page_fullContentLeft"); // ← NOUVEAU NOM

        let fullPageRight = chunker.addPage();
        fullPageRight.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", imgRight);
        fullPageRight.element.classList.add("pagedjs_page_fullContentRight"); // ← NOUVEAU NOM
        
        img.style.removeProperty("display");
        this.fullSpreadEls.delete(img);
      }
    }

    // FULL PAGE avec containers uniques
    for (let img of this.fullPageEls) {
      let container = document.createElement("div");
      container.classList.add("pagedjs_full-content_content"); // ← NOUVEAU NOM
      container.appendChild(img);
      let fullPage = chunker.addPage();

      fullPage.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", container);
      fullPage.element.classList.add("pagedjs_page_fullContent"); // ← NOUVEAU NOM
      
      img.style.removeProperty("display");
      this.fullPageEls.delete(img);
    }

    // FULL LEFT avec containers uniques
    for (let img of this.fullLeftEls) {
      if (page.element.classList.contains("pagedjs_right_page")) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_full-content_content"); // ← NOUVEAU NOM
        container.appendChild(img);
        let fullPage = chunker.addPage();

        fullPage.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", container);
        fullPage.element.classList.add("pagedjs_page_fullContent"); // ← NOUVEAU NOM
        
        img.style.removeProperty("display");
        this.fullLeftEls.delete(img);
      }
    }

    // FULL RIGHT avec containers uniques
    for (let img of this.fullRightEls) {
      if (page.element.classList.contains("pagedjs_left_page")) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_full-content_content"); // ← NOUVEAU NOM
        container.appendChild(img);
        let fullPage = chunker.addPage();

        fullPage.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", container);
        fullPage.element.classList.add("pagedjs_page_fullContent"); // ← NOUVEAU NOM
        
        img.style.removeProperty("display");
        this.fullRightEls.delete(img);
      }
    }

    // SPECIFIC PAGE avec containers uniques
    let pageNum = pageElement.id.split("page-")[1];
    pageNum = parseInt(pageNum);

    this.specificPageClone.forEach((entry) => {
      const obj = JSON.parse(entry);
      let targetedPage = obj.page;
      let prevPage = parseInt(targetedPage) - 1;
      let elem = obj.elemClone;

      if (prevPage == pageNum) {
        let container = document.createElement("div");
        container.classList.add("pagedjs_full-content_content"); // ← NOUVEAU NOM
        container.innerHTML = elem;
        let fullPage = chunker.addPage();

        fullPage.element.querySelector(".pagedjs_page_content").insertAdjacentElement("afterbegin", container);
        fullPage.element.classList.add("pagedjs_page_fullContent"); // ← NOUVEAU NOM
      }
    });
  }
}