/**
 * @name Commands
 * @file Gestion des commandes d'édition pour l'éditeur
 * @author Editor Plugin
 */

import { UNICODE_CHARS } from "./unicode.js";

export class Commands {
  constructor(editor) {
    this.editor = editor;
  }

  // ====== CRÉATION D'ÉLÉMENTS ======

  createElement(tagName, className = null) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.classList.add("editor-add");
    element.setAttribute("data-timestamp", Date.now());
    return element;
  }

  // ====== FORMATAGE ======

  toggleFormatting(tagName) {
    const selection = this.editor.selection.getCurrentSelection();
    if (!selection?.isValid) return;

    const range = selection.range;
    const selectedText = range.toString();

    if (selectedText.length === 0) return;

    // Vérifier si le texte sélectionné est déjà formaté
    const parentElement = range.commonAncestorContainer.parentElement;
    if (
      parentElement &&
      parentElement.tagName.toLowerCase() === tagName.toLowerCase()
    ) {
      // Supprimer le formatage
      this.unwrapElement(parentElement);
    } else {
      // Appliquer le formatage
      const element = this.createElement(tagName);
      try {
        range.surroundContents(element);
      } catch (e) {
        // Fallback si surroundContents échoue
        element.textContent = selectedText;
        range.deleteContents();
        range.insertNode(element);
      }
    }

    this.triggerAutoCopy();
  }

  unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }

  toggleLetterSpacing() {
    const input = document.querySelector(".ls-input");
    const value = input?.value || "0";

    const selection = this.editor.selection.getCurrentSelection();
    if (!selection?.isValid) return;

    const span = this.createElement("span", null);
    span.style.setProperty("--ls", value);
    span.setAttribute("tabindex", "0"); // Rendre focusable

    this.setupLetterSpacingControls(span);

    try {
      selection.range.surroundContents(span);
    } catch (e) {
      span.textContent = selection.range.toString();
      selection.range.deleteContents();
      selection.range.insertNode(span);
    }

    this.triggerAutoCopy();
  }

  hasParentWithTag(element, tagNames, className = null) {
    if (!Array.isArray(tagNames)) {
      tagNames = [tagNames];
    }
    tagNames = tagNames.map((tag) => tag.toUpperCase());

    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }

    while (element && element !== document.body) {
      if (element.nodeType === Node.ELEMENT_NODE) {
        const tagMatches = tagNames.includes(element.tagName);
        const classMatches =
          !className || element.classList.contains(className);

        if (tagMatches && classMatches) {
          return true;
        }
      }
      element = element.parentElement;
    }

    return false;
  }

  // ====== ACTIONS UTILITAIRES ======

  undoLastTransformation() {
    let editableElement = document.activeElement;

    if (!editableElement || !editableElement.hasAttribute("data-editable")) {
      //       console.log("Aucun élément éditable en focus");
      return;
    }

    // console.log("Element en focus:", editableElement);

    // 1. Récupérer TOUS les éléments avec timestamp
    const timestampedElements = Array.from(
      editableElement.querySelectorAll("[data-timestamp]")
    );

    // console.log("Éléments avec timestamp trouvés:", timestampedElements);
    // timestampedElements.forEach((el) =>
    //   console.log("Timestamp:", el.getAttribute("data-timestamp"))
    // );

    if (timestampedElements.length === 0) {
      console.log("Aucune transformation à annuler");
      return;
    }

    // 2. Trier par timestamp (le plus récent en premier)
    timestampedElements.sort((a, b) => {
      const timestampA = parseInt(a.getAttribute("data-timestamp"));
      const timestampB = parseInt(b.getAttribute("data-timestamp"));
      return timestampB - timestampA;
    });

    // 3. Prendre le timestamp le plus récent
    const latestTimestamp =
      timestampedElements[0].getAttribute("data-timestamp");

    // 4. Supprimer TOUS les éléments qui ont ce timestamp
    const elementsToRemove = editableElement.querySelectorAll(
      `[data-timestamp="${latestTimestamp}"]`
    );

    console.log(
      `Annulation de ${elementsToRemove.length} élément(s) avec timestamp ${latestTimestamp}`
    );

    elementsToRemove.forEach((element) => {
      const classes = element.className;

      // Supprimer complètement guillemets et espaces
      if (
        classes.includes("french-quote") ||
        classes.includes("english-quote") ||
        classes.includes("i_space") ||
        element.tagName === "BR"
      ) {
        element.parentNode?.removeChild(element);
      } else {
        // Préserver le contenu pour autres spans
        const parent = element.parentNode;
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    });

    this.triggerAutoCopy();
  }

  // ====== MÉTHODES UTILITAIRES ======

  fusionFragments(dataRef) {
    const allFragments = document.querySelectorAll(`[data-ref="${dataRef}"]`);

    let fullHTML = "";
    allFragments.forEach((fragment, index) => {
      let html = fragment.innerHTML;

      // Nettoyer les césures en fin de fragment
      if (index < allFragments.length - 1) {
        html = html.replace(/‑\s*$/, "");
      }

      fullHTML += html;
    });

    return fullHTML;
  }

  triggerAutoCopy(elementParam = null) {
    if (!this.editor.options.autoCopy) return;

    const element = elementParam || this.getCurrentElement();
    if (!element) return;

    const dataRef = element.getAttribute("data-ref");
    let content;

    if (dataRef) {
      content = this.fusionFragments(dataRef);
    } else {
      content = element.innerHTML;
    }

    const markdown = this.editor.toolbar.recovery
      .getTurndownService()
      .turndown(content);

    // Ajouter try/catch pour gérer l'erreur clipboard
    navigator.clipboard
      .writeText(markdown)
      .then(() => this.editor.showFeedback("Copié !"))
      .catch(() => {
        // Fallback silencieux ou message alternatif
        console.log("Clipboard non accessible");
      });
  }

  exportMarkdownByRange() {
    if (this.editor.toolbar.recovery) {
      this.editor.toolbar.recovery.showPageRangeModal();
    }
  }

  getCurrentElement() {
    return this.editor.getCurrentElement();
  }
}
