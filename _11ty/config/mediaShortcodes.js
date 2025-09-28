const fs = require("fs");
const path = require("path");

const config = require("./siteData.js");

const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const md = markdownIt({
  html: true,
  breaks: true,
  linkify: false,
  typographer: true,
});

md.use(markdownItFootnote);

module.exports = function (eleventyConfig) {
  let globalElementCounter = 0;

  // Fonction pour slugifier le src
  function slugify(text) {
    if (!text) return '';
    // Garde seulement le nom du fichier
    const filename = path.basename(text);
    return filename
      .toLowerCase()
      .replace(/\.[^/.]+$/, "") // Supprime l'extension
      .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères non alphanumériques par des tirets
      .replace(/^-+|-+$/g, '') // Supprime les tirets en début et fin
      .replace(/-+/g, '-'); // Remplace les tirets multiples par un seul
  }

  function generateStyles(config) {
    const cssVarMapping = {
      col: "--col",
      printCol: "--print-col",
      printcol: "--print-col",
      width: "--width",
      printWidth: "--print-width",
      printwidth: "--print-width",
      printRow: "--print-row",
      printrow: "--print-row",
      printHeight: "--print-height",
      printheight: "--print-height",
      alignSelf: "--align-self",
      alignself: "--align-self",
      "align-self": "--align-self",
      imgX: "--img-x",
      imgx: "--img-x",
      imgY: "--img-y",
      imgy: "--img-y",
      imgW: "--img-w",
      imgw: "--img-w",
      page: "--pagedjs-full-page",
      content: "--pagedjs-full-content",
    };

    let styles = "";
    
    // Traitement des propriétés CSS via cssVarMapping
    Object.entries(config).forEach(([key, value]) => {
      if (
        cssVarMapping[key] &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const cleanValue =
          typeof value === "string" ? value.replace(/^["']|["']$/g, "") : value;
        styles += `${cssVarMapping[key]}: ${cleanValue}; `;
      }
    });
    
    // Ajout du style personnalisé s'il existe
    if (config.style) {
      const cleanStyle = config.style.endsWith(';') ? config.style : config.style + ';';
      styles += cleanStyle + ' ';
    }
    
    return styles ? ` style="${styles.trim()}"` : "";
  }

  function generateHTML(type, config) {
    const styleAttr = generateStyles(config);
    const classAttr = config.class ? ` ${config.class}` : "";
    const captionHTML = config.caption ? md.renderInline(config.caption) : "";
    const slugifiedSrc = slugify(config.src);
    const elementId = config.id || slugifiedSrc;
    
    let cleanAlt = "";
    if (config.caption) {
      cleanAlt = config.caption
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[^;]+;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Incrémenter le compteur pour tous les types qui en ont besoin
    if (["image", "grid", "fullcontent", "fullpage", "markdown", "figure"].includes(type)) {
      globalElementCounter++;
    }

    switch (type) {
      case "image":
        let outputImage = `<figure data-id="${elementId}" data-src="${config.src}" data-type="${type}" id="${elementId}" class="figure image${classAttr}"${styleAttr}>
          <img src="${config.src}" alt="${cleanAlt}" >`;
        
        if (captionHTML) {
          outputImage += `<figcaption class="figcaption">${captionHTML}</figcaption>`;
        }
        
        outputImage += `</figure>`;
        return outputImage;

      case "grid":
        let output = `<figure data-id="${elementId}" data-src="${config.src}" data-type="${type}" data-grid="image" class="${classAttr}" id="${elementId}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
      </figure>`;
        if (captionHTML) {
          output += `<figcaption class="figcaption figcaption-${slugifiedSrc}" ${styleAttr}>${captionHTML}</figcaption>`;
        }
        return output;

      case "fullcontent":
        return `<figure data-id="${elementId}" data-src="${config.src}" data-grid="image" data-type="${type}" id="${elementId}" class="full-content ${classAttr}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}">
      </figure>`;

      case "fullpage":
        return `<figure data-id="${elementId}" data-src="${config.src}" data-grid="image" data-type="${type}" id="${elementId}" class="full-page ${classAttr}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}">
      </figure>`;

      case "figure":
        let outputFigure = `<figure data-id="${elementId}" data-src="${config.src}" data-type="${type}" data-grid="image" id="${elementId}" class="figure ${classAttr}"${styleAttr}>
          <img src="${config.src}" alt="${cleanAlt}" >`;
        
        if (captionHTML) {
          outputFigure += `<figcaption class="figcaption">${captionHTML}</figcaption>`;
        }
        
        outputFigure += `</figure>`;
        return outputFigure;

      case "imagenote":
        return `<span class="imagenote sideNote${classAttr}" data-src="${config.src}" data-grid="image"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
        ${captionHTML ? `<span class="caption">${captionHTML}</span>` : ""}
      </span>`;

      case "video":
        const posterAttr = config.poster ? ` poster="${config.poster}"` : "";
        return `<figure class="video${classAttr}" data-grid="content"${styleAttr}>
        <video controls${posterAttr}>
          <source src="${config.src}">
        </video>
        ${
          captionHTML
            ? `<figcaption class="figcaption">${captionHTML}</figcaption>`
            : ""
        }
      </figure>`;

      default:
        return `<!-- Type ${type} non supporté -->`;
    }
  }

  eleventyConfig.on("eleventy.before", () => {
    globalElementCounter = 0;
  });

  eleventyConfig.addShortcode("image", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("image", config);
  });

  eleventyConfig.addAsyncShortcode(
    "grid",
    async function (firstParam, options = {}) {
      // Détection automatique du type de contenu
      const isMarkdownFile = firstParam.endsWith(".md");
      

      if (isMarkdownFile) {
        // Traitement markdown
        let parsedOptions = {};
        if (typeof options === "string") {
          try {
            const cleanString = options.replace(/,(\s*[}\]])/g, "$1");
            parsedOptions = Function(`"use strict"; return (${cleanString})`)();
          } catch (e) {
            parsedOptions = {};
          }
        } else {
          parsedOptions = options || {};
        }

        const cleanFile = firstParam
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .trim();
        const filePath = path.join(`./${config.publicFolder}`, cleanFile);

        try {
          const content = await fs.promises.readFile(filePath, "utf8");
          globalElementCounter++;

          const styleAttr = generateStyles(parsedOptions);
          const classAttr = parsedOptions.class
            ? ` class="${parsedOptions.class}"`
            : "";
          const slugifiedFile = slugify(cleanFile);
          const elementId = parsedOptions.id || slugifiedFile;

          const renderedContent = cleanFile.endsWith(".md")
            ? md.render(content)
            : content;
          return `<div data-grid="markdown" data-type="markdown" data-md="${cleanFile}" id="${elementId}"${classAttr}${styleAttr}>${renderedContent}</div>`;
        } catch (error) {
          console.error(`Erreur inclusion ${cleanFile}:`, error.message);
          return `<div class="include error">❌ Erreur: ${cleanFile} non trouvé</div>`;
        }
      } else {
        // Traitement comme image
        const config = { src: firstParam, ...options };
        return generateHTML("grid", config);
      }
    }
  );

  eleventyConfig.addShortcode("video", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("video", config);
  });

  eleventyConfig.addShortcode("figure", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("figure", config);
  });

  eleventyConfig.addShortcode("imagenote", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("imagenote", config);
  });

  eleventyConfig.addShortcode("fullcontent", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("fullcontent", config);
  });

  eleventyConfig.addShortcode("fullpage", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("fullpage", config);
  });

  eleventyConfig.addAsyncShortcode(
    "markdown",
    async function (file, optionsString) {
      // Parse manuel pour supporter les trailing commas
      let options = {};
      if (typeof optionsString === "string") {
        try {
          // Nettoie les trailing commas
          const cleanString = optionsString.replace(/,(\s*[}\]])/g, "$1");
          options = Function(`"use strict"; return (${cleanString})`)();
        } catch (e) {
          console.warn("Erreur parsing options markdown:", e.message);
          options = {};
        }
      } else if (typeof optionsString === "object") {
        options = optionsString || {};
      }
      const cleanFile = file.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
      const filePath = path.join(`./${config.publicFolder}`, cleanFile);

      try {
        const content = await fs.promises.readFile(filePath, "utf8");

        globalElementCounter++;

        const styleAttr = generateStyles(options);
        const classAttr = options.class ? ` class="${options.class}"` : "";
        const slugifiedFile = slugify(cleanFile);
        const elementId = slugifiedFile;

        const renderedContent = cleanFile.endsWith(".md")
          ? md.render(content)
          : content;

        return `<div data-grid="markdown" data-type="markdown" data-md="${cleanFile}" data-src="${cleanFile}"  id="${elementId}"${classAttr}${styleAttr}><div class="content-wrapper">${renderedContent}</div></div>`;
      } catch (error) {
        console.error(`Erreur inclusion ${cleanFile}:`, error.message);
        return `<div class="include error">❌ Erreur: ${cleanFile} non trouvé</div>`;
      }
    }
  );

};




