export function typographyPlugin(turndownService) {
  // Small caps
  turndownService.addRule("smallcaps", {
    filter: function (node) {
      return node.nodeName === "SPAN" && node.classList.contains("small-caps");
    },
    replacement: function (content) {
      return `<smallcaps>${content}</smallcaps>`;
    },
  });

  // Letter spacing
  turndownService.addRule("letterSpacing", {
    filter: function (node) {
      return node.nodeName === "SPAN" && node.style.getPropertyValue("--ls") !== "";
    },
    replacement: function (content, node) {
      const lsValue = node.style.getPropertyValue("--ls");
      return `<span style="--ls:${lsValue}">${content}</span>`;
    },
  });

  // Superscript
  turndownService.addRule("superscript", {
    filter: "sup",
    replacement: function (content) {
      return `<sup>${content}</sup>`;
    },
  });


    // Subscript
  turndownService.addRule("subscript", {
    filter: "sub",
    replacement: function (content) {
      return `<sub>${content}</sub>`;
    },
  });


  // Préserver les tirets typographiques dans les spans editor-add
  turndownService.addRule("preserveDashes", {
    filter: function (node) {
      if (node.nodeName !== "SPAN") return false;
      const text = node.textContent;
      // Détecter les tirets demi-cadratin (–) et cadratin (—)
      return text === "\u2013" || text === "\u2014";
    },
    replacement: function (content) {
      return content; // Préserver tel quel
    },
  });

}