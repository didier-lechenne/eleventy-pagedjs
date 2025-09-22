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
      imgW: "--img-w",
      page: "--pagedjs-full-page",
      fullPage: "--pagedjs-full-page",
      fullpage: "--pagedjs-full-page",
      fold: "--pagedjs-fold",
    };

    let styles = "";
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
    return styles ? ` style="${styles}"` : "";
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

    if (["image", "grid", "fullpage", "fullcontent", "figure"].includes(type)) {
      globalElementCounter++;
    }

    switch (type) {
      case "image":
        return `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" data-grid="image" id="image-${globalElementCounter}" class="figure image${classAttr}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
        ${captionHTML ? `<figcaption class="figcaption">${captionHTML}</figcaption>` : ""}
      </figure>`;

      case "grid":
        let output = `<figure data-id="${id}" data-src="${config.src}" data-type="${type}"  data-grid="image" class="${classAttr}" id="figure-${globalElementCounter}"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
      </figure>`;
        if (captionHTML) {
          output += `<figcaption class="figcaption figcaption-${globalElementCounter}" ${styleAttr}>${captionHTML}</figcaption>`;
        }
        return output;

      case "fullpage":
        let pageValue = config.page || config.fullPage || config.fullpage || "page";
        const pageStyle = `--pagedjs-full-page: ${pageValue};`;
        const fullPageStyleAttr = styleAttr 
          ? styleAttr.replace(' style="', ` style="${pageStyle}`)
          : ` style="${pageStyle}"`;

        return `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" data-grid="fullpage" id="fullpage-${globalElementCounter}" class="fullpage-element${classAttr}"${fullPageStyleAttr}>
        <img src="${config.src}" alt="${cleanAlt}">
        ${captionHTML ? `<figcaption class="figcaption">${captionHTML}</figcaption>` : ""}
      </figure>`;

      case "fullcontent":
        let contentValue = config.page || config.fullPage || config.fullpage || "page";
        const contentStyle = `--pagedjs-full-page: ${contentValue};`;
        const fullContentStyleAttr = styleAttr 
          ? styleAttr.replace(' style="', ` style="${contentStyle}`)
          : ` style="${contentStyle}"`;

        return `<figure data-id="${id}" data-src="${config.src}" data-type="${type}" data-grid="fullcontent" id="fullcontent-${globalElementCounter}" class="fullcontent-element${classAttr}"${fullContentStyleAttr}>
        <img src="${config.src}" alt="${cleanAlt}">
        ${captionHTML ? `<figcaption class="figcaption">${captionHTML}</figcaption>` : ""}
      </figure>`;

      case "imagenote":
        return `<span class="imagenote sideNote${classAttr}" data-type="${type}" data-src="${config.src}" data-grid="image"${styleAttr}>
        <img src="${config.src}" alt="${cleanAlt}" >
        ${captionHTML ? `<span class="caption">${captionHTML}</span>` : ""}
      </span>`;

      case "video":
        const posterAttr = config.poster ? ` poster="${config.poster}"` : "";
        return `<figure class="video${classAttr}" data-type="${type}" data-grid="content"${styleAttr}>
        <video controls${posterAttr}>
          <source src="${config.src}">
        </video>
        ${captionHTML ? `<figcaption class="figcaption">${captionHTML}</figcaption>` : ""}
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
      const isMarkdownFile = firstParam.endsWith(".md");

      if (isMarkdownFile) {
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

        const cleanFile = firstParam.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
        const filePath = path.join(`./${config.publicFolder}`, cleanFile);

        try {
          const content = await fs.promises.readFile(filePath, "utf8");
          globalElementCounter++;

          const styleAttr = generateStyles(parsedOptions);
          const classAttr = parsedOptions.class ? ` class="${parsedOptions.class}"` : "";
          const idAttr = parsedOptions.id ? ` id="${parsedOptions.id}"` : ` id="markdown-${globalElementCounter}"`;

          const renderedContent = cleanFile.endsWith(".md") ? md.render(content) : content;
          return `<div data-type="markdown" data-grid="markdown" data-src="${cleanFile}"${idAttr}${classAttr}${styleAttr}>${renderedContent}</div>`;
        } catch (error) {
          console.error(`Erreur inclusion ${cleanFile}:`, error.message);
          return `<div class="include error">❌ Erreur: ${cleanFile} non trouvé</div>`;
        }
      } else {
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

  eleventyConfig.addShortcode("fullpage", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("fullpage", config);
  });

  eleventyConfig.addShortcode("fullcontent", function (src, options = {}) {
    const config = { src, ...options };
    return generateHTML("fullcontent", config);
  });

  eleventyConfig.addAsyncShortcode(
    "markdown",
    async function (file, optionsString) {
      let options = {};
      if (typeof optionsString === "string") {
        try {
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
        const idAttr = options.id ? ` id="${options.id}"` : ` id="markdown-${globalElementCounter}"`;

        const renderedContent = cleanFile.endsWith(".md") ? md.render(content) : content;

        return `<div data-grid="markdown" data-src="${cleanFile}"${idAttr}${classAttr}${styleAttr}>${renderedContent}</div>`;
      } catch (error) {
        console.error(`Erreur inclusion ${cleanFile}:`, error.message);
        return `<div class="include error">❌ Erreur: ${cleanFile} non trouvé</div>`;
      }
    }
  );
};