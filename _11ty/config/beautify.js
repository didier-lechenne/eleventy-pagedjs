const beautify = require('js-beautify').html;

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform("beautifyHTML", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      // Nettoyage préalable pour vos problèmes spécifiques
      content = content
        // Nettoie les espaces multiples dans les classes
        .replace(/class="\s+/g, 'class="')
        .replace(/\s+"/g, '"')
        // Supprime les lignes vides excessives dans les attributs
        .replace(/\n\s*\n\s*\n/g, '\n')
        // Nettoie les espaces avant la fermeture des tags
        .replace(/\s+>/g, '>');
      
      // Beautify d'abord
      content = beautify(content, {
        indent_size: 2,
        indent_char: ' ',
        preserve_newlines: false,
        max_preserve_newlines: 1,
        wrap_attributes: 'auto',
        wrap_attributes_indent_size: 2,
        wrap_line_length: 0,
        end_with_newline: true,
        extra_liners: ['head', 'body', '/html'],
        unformatted: ['pre', 'code'],
        content_unformatted: ['pre', 'textarea']
      });
      
      // Puis ajouter des espaces entre les sections
      content = content
        // Ajoute une ligne vide avant chaque section
        .replace(/(<section)/g, '\n$1')
        // Ajoute une ligne vide après chaque section fermante
        .replace(/(<\/section>)/g, '$1\n')
        // Ajoute des espaces autour d'autres éléments de structure
        .replace(/(<main)/g, '\n$1')
        .replace(/(<\/main>)/g, '$1\n')
        .replace(/(<article)/g, '\n$1')
        .replace(/(<\/article>)/g, '$1\n')
        .replace(/(<header)/g, '\n$1')
        .replace(/(<\/header>)/g, '$1\n')
        .replace(/(<footer)/g, '\n$1')
        .replace(/(<\/footer>)/g, '$1\n')
        // Nettoie les lignes vides multiples
        .replace(/\n{3,}/g, '\n\n');
      
      return content;
    }
    return content;
  });
};