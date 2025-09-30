const Hypher = require('hypher');
const french = require('hyphenation.fr');
const { JSDOM } = require('jsdom');
const h = new Hypher(french);

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform("softHyphens", function(content, outputPath) {
    if (outputPath && outputPath.endsWith("print.html")) {
      const dom = new JSDOM(content);
      const doc = dom.window.document;
      
      // Parcourir tous les nœuds texte dans <p>
      const paragraphs = doc.querySelectorAll('main p');
      paragraphs.forEach(p => {
        walkTextNodes(p, (textNode) => {
          textNode.textContent = h.hyphenateText(textNode.textContent);
        });
      });
      
      return dom.serialize();
    }
    return content;
  });
};

function walkTextNodes(node, callback) {
  


  if (node.nodeType === 3) {
    // Vérifier ICI avant d'appeler callback
    if (!node.parentElement?.classList?.contains('i_space')) {
      callback(node);
    }
  } else {
    node.childNodes.forEach(child => walkTextNodes(child, callback));
  }
}