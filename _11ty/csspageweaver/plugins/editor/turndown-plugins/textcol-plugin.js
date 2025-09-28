export function textColPlugin(turndownService) {
  turndownService.addRule("textCol", {
    filter: function (node) {
      return node.nodeName === "DIV" && node.classList.contains("textCol");
    },
    replacement: function (content, node) {
      let processedContent = content;
      let innerHTML = node.innerHTML;
      let breakRegex = /<div[^>]*breakcolumn[^>]*><\/div>\s*(\w+)/g;
      let match;
      while ((match = breakRegex.exec(innerHTML)) !== null) {
        let wordAfter = match[1];
        processedContent = processedContent.replace(
          wordAfter,
          `\n<breakcolumn>\n${wordAfter}`
        );
      }

      const gridCol = node.style.getPropertyValue("--grid-col") || "12";
      const gridColGutter = node.style.getPropertyValue("--grid-col-gutter") || "";

      let attributes = `gridCol="${gridCol}"`;
      if (gridColGutter) {
        attributes += ` gridColGutter="${gridColGutter}"`;
      }

      return `<textCol ${attributes}>\n${processedContent}\n</textCol>`;
    },
  });


turndownService.addRule("markdownContainersModularGrid", {
  filter: function (node) {
    return node.nodeName === "DIV" && node.classList.contains("modularGrid");
  },
  replacement: function (content, node) {
    const style = node.getAttribute('style');
    let attributes = '';
    
    if (style) {
      attributes = ` {style="${style}"}`;
    }
    
    return `\n\n::: modularGrid${attributes}\n${content}\n:::\n\n`;
  },
});



}

