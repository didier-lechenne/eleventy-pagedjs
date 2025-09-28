import { TurndownService } from "./lib/turndown.js";
import * as turndownPlugins from "./turndown-plugins/index.js";

export class PagedMarkdownRecovery {
  constructor() {
    this.turndownService = this.initializeTurndown();
  }

  initializeTurndown() {
    const turndown = new TurndownService({
      headingStyle: "atx",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      fence: "```",
    });

    turndown.use(Object.values(turndownPlugins));
    return turndown;
  }

  /**
   * Fonction utilitaire pour convertir en camelCase
   */
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Reconstructs split elements from paginated content
   */
  reconstructSplitElements(content) {
    const sections = content.querySelectorAll("section");
    if (sections.length === 0) return;

    let combinedContent = "";
    sections.forEach((section) => {
      combinedContent += section.innerHTML;
    });

    content.innerHTML = `<section>${combinedContent}</section>`;

    const section = content.querySelector("section");
    const fragmentGroups = new Map();

    section.querySelectorAll("[data-ref]").forEach((element) => {
      const ref = element.getAttribute("data-ref");
      if (!fragmentGroups.has(ref)) {
        fragmentGroups.set(ref, []);
      }
      fragmentGroups.get(ref).push(element);
    });

    fragmentGroups.forEach((fragments) => {
      if (fragments.length > 1) {
        const firstFragment = fragments[0];
        let completeContent = "";

        fragments.forEach((fragment) => {
          completeContent += fragment.innerHTML;
        });

        firstFragment.innerHTML = completeContent;

        for (let i = 1; i < fragments.length; i++) {
          fragments[i].remove();
        }
      }
    });

    this.fixBrokenBlockquotes(section);

    const footnotesSep = section.querySelector("hr.footnotes-sep");
    if (footnotesSep) footnotesSep.remove();

    const footnotesSection = section.querySelector("section.footnotes");
    if (footnotesSection) footnotesSection.remove();
  }

  fixBrokenBlockquotes(container) {
    const blockquotes = container.querySelectorAll("blockquote");

    blockquotes.forEach((blockquote) => {
      const paragraphs = blockquote.querySelectorAll("p");

      paragraphs.forEach((p, index) => {
        const text = p.textContent.trim();
        const nextP = paragraphs[index + 1];

        if (nextP && text && !text.match(/[.!?»"]\s*$/)) {
          p.innerHTML += " " + nextP.innerHTML;
          nextP.remove();
        }
      });
    });
  }

  /**
   * Export des pages avec front matter correctement formaté
   */
  exportPageRange(startPage, endPage, filename = "pages-selection.md") {
    // 1. Récupérer le data-template et le front matter de la page de départ
    const startPageElement = document.querySelector(
      `[data-page-number="${startPage}"] section`
    );
    if (!startPageElement) {
      console.warn(`❌ Page ${startPage} introuvable`);
      return;
    }
    const targetTemplate = startPageElement.getAttribute("data-template");

    // 2. Extraire le front matter avec conversion camelCase
    const frontMatter = {};

    // Mapping des attributs spéciaux pour une conversion correcte
    const attributeMapping = {
      'gridcol': 'gridCol',
      'gridrow': 'gridRow', 
      'gridcolgutter': 'gridColGutter',
      'gridrowgutter': 'gridRowGutter',
      'toc': 'toc',
      'show': 'show',
      'class': 'class',
      'title': 'title',
      'template': 'template'
    };

    for (const attr of startPageElement.attributes) {
      if (attr.name.startsWith("frontmatter-")) {
        const originalKey = attr.name.replace("frontmatter-", "");
        
        // Utiliser le mapping ou convertir en camelCase
        const key = attributeMapping[originalKey] || this.toCamelCase(originalKey);
        
        frontMatter[key] = attr.value;
      }
    }

    // Ajouter draft: false par défaut si non présent
    if (!frontMatter.draft) {
      frontMatter.draft = false;
    }

    // 3. Collecter les sections cibles
    const selectedPages = [];
    for (let i = startPage; i <= endPage; i++) {
      const page = document.querySelector(`[data-page-number="${i}"] section`);
      if (page && page.getAttribute("data-template") === targetTemplate) {
        selectedPages.push(page.cloneNode(true));
      }
    }

    // 4. Vérification
    if (selectedPages.length === 0) {
      console.error(
        `❌ Aucune page trouvée avec le template "${targetTemplate}"`
      );
      return;
    }

    // 5. Reconstituer le contenu
    const container = document.createElement("div");
    selectedPages.forEach((page) => container.appendChild(page));
    this.reconstructSplitElements(container);

    // 6. Convertir en Markdown
    let markdownContent = this.getTurndownService().turndown(
      container.innerHTML
    );

    // markdownContent = markdownContent
    //   .replace(/<breakcolumn>(?!\s*\/)/g, "<breakcolumn />")
    //   .replace(/<breakpage>(?!\s*\/)/g, "<breakpage />");

    // 7. Ajouter le front matter au Markdown
    const frontMatterYaml = `---
${Object.entries(frontMatter)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}
---
`;
    const fullMarkdown = frontMatterYaml + markdownContent;

    // 8. Télécharger le fichier
    const templateSuffix = targetTemplate ? `-${targetTemplate}` : "";
    const enrichedFilename = filename.replace(".md", `${templateSuffix}.md`);
    this.downloadFile(fullMarkdown, enrichedFilename, "text/markdown");

    return fullMarkdown;
  }

  showPageRangeModal() {
    const totalPages = this.getTotalPages();
    const input = prompt(
      `Pages à exporter (ex: 1-5 ou 3,7,9)\nTotal: ${totalPages} pages`
    );

    if (!input) return;

    if (input.includes("-")) {
      const [start, end] = input.split("-").map((n) => parseInt(n.trim()));
      this.exportPageRange(start, end, `pages-${start}-${end}.md`);
    } else if (input.includes(",")) {
      const pages = input.split(",").map((n) => parseInt(n.trim()));
      const start = Math.min(...pages);
      const end = Math.max(...pages);
      this.exportPageRange(start, end, `pages-selection.md`);
    } else {
      const page = parseInt(input);
      this.exportPageRange(page, page, `page-${page}.md`);
    }
  }

  getTotalPages() {
    const pages = document.querySelectorAll("[data-page-number]");
    return pages.length;
  }

  getTurndownService() {
    return window.mainTurndownService || this.turndownService;
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}