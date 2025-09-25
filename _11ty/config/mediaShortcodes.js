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

function generateStyles(config) {
  const cssVarMapping = {
    col: "--col",
    printCol: "--print-col",
    width: "--width",
    printWidth: "--print-width",
    printRow: "--print-row",
    printHeight: "--print-height",
    alignSelf: "--align-self",
    alignself: "--align-self",
    "align-self": "--align-self",
    imgX: "--img-x",
    imgY: "--img-y",
    imgW: "--img-w"
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
    const id = config.id;
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
    if (["image", "grid", "fullcontent", "fullpage" , "mardown", "figure"].includes(type)) {
      globalElementCounter++;
    }

    switch (type) {
      case "image":
        let outputImage = `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" id="figure-${globalElementCounter}" class="figure image${classAttr}"${styleAttr}>
          <img src="${config.src}" alt="${cleanAlt}" >`;
        
        if (captionHTML) {
          outputImage += `<figcaption class="figcaption">${captionHTML}</figcaption>`;
        }
        
        outputImage += `</figure>`;
        return outputImage;

      case "grid":
        let output = `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" data-grid="image" class="${classAttr}" id="figure-${globalElementCounter}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
      </figure>`;
        if (captionHTML) {
          output += `<figcaption class="figcaption figcaption-${globalElementCounter}" ${styleAttr}>${captionHTML}</figcaption>`;
        }
        return output;

      case "figure":
        let outputFigure = `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" data-grid="image" id="figure-${globalElementCounter}" class="figure ${classAttr}"${styleAttr}>
          <img src="${config.src}" alt="${cleanAlt}" >`;
        
        if (captionHTML) {
          outputFigure += `<figcaption class="figcaption">${captionHTML}</figcaption>`;
        }
        
        outputFigure += `</figure>`;
        return outputFigure;

      case "imagenote":
        return `<span class="imagenote sideNote${classAttr}" data-src="${config.src}" data-grid="image"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
        ${captionHTML ? `<span class="caption">${captionHTML}</span>` : null}
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
            : null
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
          const idAttr = parsedOptions.id
            ? ` id="${parsedOptions.id}"`
            : ` id="markdown-${globalElementCounter}"`;

          const renderedContent = cleanFile.endsWith(".md")
            ? md.render(content)
            : content;
          return `<div data-grid="markdown" data-type="markdown" data-md="${cleanFile}"${idAttr}${classAttr}${styleAttr}>${renderedContent}</div>`;
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
        const idAttr = options.id
          ? ` id="${options.id}"`
          : ` id="markdown-${globalElementCounter}"`;

        const renderedContent = cleanFile.endsWith(".md")
          ? md.render(content)
          : content;

        return `<div data-grid="markdown" data-type="markdown" data-md="${cleanFile}"${idAttr}${classAttr}${styleAttr}>${renderedContent}</div>`;
      } catch (error) {
        console.error(`Erreur inclusion ${cleanFile}:`, error.message);
        return `<div class="include error">❌ Erreur: ${cleanFile} non trouvé</div>`;
      }
    }
  );

};