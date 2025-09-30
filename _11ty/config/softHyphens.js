const config = require("./siteData.js");
const Hypher = require('hypher');
const french = require('hyphenation.fr');
const { JSDOM } = require('jsdom');

const h = new Hypher(french, {
  minWordLength: 6,
  leftmin: 3,
  rightmin: 2
});

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform("softHyphens", function(content, outputPath) {
    if (outputPath && outputPath.endsWith("print.html")) {
      const dom = new JSDOM(content);
      const doc = dom.window.document;
      
      // Construire selectors selon config
      const selectors = [];
      
      if (config['cesures_paragraphe'] === 'true') {
        selectors.push('section[data-template] p', 'blockquote');
      }
      
      if (config['cesures_footnotes'] === 'true') {
        selectors.push('section.footnotes p');
      }
      
      selectors.forEach(selector => {
        doc.querySelectorAll(selector).forEach(el => {
          walkTextNodes(el, (textNode) => {
            textNode.textContent = h.hyphenateText(textNode.textContent);
          });
        });
      });
      
      return dom.serialize();
    }
    return content;
  });
};

function walkTextNodes(node, callback) {
  if (node.nodeType === 3) {
    if (!node.parentElement?.classList?.contains('i_space')) {
      callback(node);
    }
  } else {
    node.childNodes.forEach(child => walkTextNodes(child, callback));
  }
}