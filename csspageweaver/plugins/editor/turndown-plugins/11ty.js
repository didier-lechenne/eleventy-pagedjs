export function _11tyPlugin(turndownService) {

  // Fonction utilitaire pour extraire les paramètres CSS et autres
  function extractAllParams(node, caption = '') {
    const params = {};
    
    // ID
    // const dataId = node.getAttribute('data-id');
    // const id = dataId || node.id || node.getAttribute('id');
    // if (id) {
    //   params.id = `"${id}"`;
    // }
    
    // Caption
    if (caption) {
      const escapedCaption = caption.replace(/"/g, '\\"');
      params.caption = `"${escapedCaption}"`;
    }
    
    // Classes (filtrer les classes système)
    const classList = Array.from(node.classList).filter(cls => 
      !['figure', 'full-page', 'full-content', 'image', 'video', 'imagenote'].includes(cls) &&
      !cls.startsWith('pagedjs_') && 
      !cls.includes('pagedjs')
    );
    if (classList.length > 0) {
      params.class = `"${classList.join(' ')}"`;
    }
    
    // Variables CSS
    const style = node.getAttribute('style');
    if (style) {
      const cssVars = parseCSSVariables(style);
      const styleMapping = {
        'print-col': 'printCol',
        'print-width': 'printWidth', 
        'print-row': 'printRow',
        'print-height': 'printHeight',
        'img-x': 'imgX',
        'img-y': 'imgY',
        'img-w': 'imgW',
        'align-self': 'alignSelf',
        'col': 'col',
        'width': 'width',
        'pagedjs-full-page': 'page'
      };
      
      Object.entries(cssVars).forEach(([cssVar, value]) => {
        const paramName = styleMapping[cssVar] || cssVar;
        if (paramName === 'alignSelf') {
          params[paramName] = `"${value}"`;
        } else {
          params[paramName] = isNaN(value) ? `"${value}"` : parseFloat(value);
        }
      });
    }
    
    return params;
  }
  
  // Parser CSS variables
  function parseCSSVariables(styleString) {
    const cssVars = {};
    if (!styleString) return cssVars;
    
    const declarations = styleString.split(';').map(d => d.trim()).filter(d => d);
    declarations.forEach(declaration => {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && property.startsWith('--') && value) {
        cssVars[property.substring(2)] = value;
      }
    });
    
    return cssVars;
  }
  
  // Formater les paramètres en objet JavaScript
  function formatParams(params) {
    if (Object.keys(params).length === 0) return '';
    
    const entries = Object.entries(params).map(([key, value]) => {
      return `  ${key}: ${value}`;
    });
    
    return `, { \n${entries.join(',\n')}\n}`;
  }

  // Règle pour type image
  turndownService.addRule('eleventy-image', {
    filter: function(node) {
      return node.nodeName === 'FIGURE' && 
             node.getAttribute('data-type') === 'image' &&
             node.querySelector('img');
    },
    replacement: function(content, node) {
      const src = node.getAttribute('data-src') || node.querySelector('img')?.getAttribute('src') || '';
      // const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      const cleanSrc = src;
      
      const figcaption = node.querySelector('figcaption');
      const caption = figcaption ? (figcaption.textContent || figcaption.innerText).trim() : '';
      
      const params = extractAllParams(node, caption);
      const optionsStr = formatParams(params);
      
      return `\n\n{% image "${cleanSrc}"${optionsStr} %}\n\n`;
    }
  });

  // Règle pour type grid
  turndownService.addRule('eleventy-grid', {
    filter: function(node) {
      return node.nodeName === 'FIGURE' && 
             node.getAttribute('data-type') === 'grid' &&
             node.querySelector('img');
    },
    replacement: function(content, node) {
      const src = node.getAttribute('data-src') || node.querySelector('img')?.getAttribute('src') || '';
      // const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      const cleanSrc = src;
      
      // Caption peut être dans figcaption suivant
      const nextElement = node.nextElementSibling;
      const caption = (nextElement && nextElement.classList.contains('figcaption'))
        ? (nextElement.textContent || nextElement.innerText).trim()
        : '';
      
      const params = extractAllParams(node, caption);
      const optionsStr = formatParams(params);
      
      return `\n\n{% grid "${cleanSrc}"${optionsStr} %}\n\n`;
    }
  });

  // Règle pour type fullpage
  turndownService.addRule('eleventy-fullpage', {
    filter: function(node) {
      return node.nodeName === 'FIGURE' && 
             node.getAttribute('data-type') === 'fullpage' &&
             node.querySelector('img');
    },
    replacement: function(content, node) {
      const src = node.getAttribute('data-src') || node.querySelector('img')?.getAttribute('src') || '';
      // const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      const cleanSrc = src;
      
      const params = extractAllParams(node);
      const optionsStr = formatParams(params);
      
      return `\n\n{% fullpage "${cleanSrc}"${optionsStr} %}\n\n`;
    }
  });

  // Règle pour type figure
  turndownService.addRule('eleventy-figure', {
    filter: function(node) {
      return node.nodeName === 'FIGURE' && 
             node.getAttribute('data-type') === 'figure' &&
             node.querySelector('img');
    },
    replacement: function(content, node) {
      const src = node.getAttribute('data-src') || node.querySelector('img')?.getAttribute('src') || '';
      // const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      const cleanSrc = src;
      
      const figcaption = node.querySelector('figcaption');
      const caption = figcaption ? (figcaption.textContent || figcaption.innerText).trim() : '';
      
      const params = extractAllParams(node, caption);
      const optionsStr = formatParams(params);
      
      return `\n\n{% figure "${cleanSrc}"${optionsStr} %}\n\n`;
    }
  });

  // Règle pour type video
  turndownService.addRule('eleventy-video', {
    filter: function(node) {
      return node.nodeName === 'FIGURE' && 
             node.getAttribute('data-type') === 'video' &&
             node.querySelector('video');
    },
    replacement: function(content, node) {
      const video = node.querySelector('video source');
      const src = node.getAttribute('data-src') || video?.getAttribute('src') || '';
      const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      
      const figcaption = node.querySelector('figcaption');
      const caption = figcaption ? (figcaption.textContent || figcaption.innerText).trim() : '';
      
      // Ajouter poster si présent
      const videoEl = node.querySelector('video');
      const params = extractAllParams(node, caption);
      if (videoEl?.getAttribute('poster')) {
        params.poster = `"${videoEl.getAttribute('poster')}"`;
      }
      
      const optionsStr = formatParams(params);
      
      return `\n\n{% video "${cleanSrc}"${optionsStr} %}\n\n`;
    }
  });

  // Règle pour type imagenote
  turndownService.addRule('eleventy-imagenote', {
    filter: function(node) {
      return node.nodeName === 'SPAN' && 
             node.getAttribute('data-type') === 'imagenote' &&
             node.querySelector('img');
    },
    replacement: function(content, node) {
      const src = node.getAttribute('data-src') || node.querySelector('img')?.getAttribute('src') || '';
      // const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
      const cleanSrc = src;
      
      const captionSpan = node.querySelector('.caption');
      const caption = captionSpan ? (captionSpan.textContent || captionSpan.innerText).trim() : '';
      
      const params = extractAllParams(node, caption);
      const optionsStr = formatParams(params);
      
      return `{% imagenote "${cleanSrc}"${optionsStr} %}`;
    }
  });

  // Règle pour type markdown/include


  turndownService.addRule("eleventy-markdown", {
    filter: function (node) {
      return (
        node.nodeName === "DIV" &&
        (node.getAttribute("data-type") === "markdown" ||
          node.getAttribute("data-type") === "include")
      );
    },
    replacement: function (content, node) {
      const src = node.getAttribute("data-md") || "";
      const params = extractAllParams(node);
      const optionsStr = formatParams(params);

      return `\n\n{% markdown "${src}"${optionsStr} %}\n\n`;
    },
  });

  // Masquer les figcaption séparées pour type grid
  turndownService.addRule('hide-separate-figcaption', {
    filter: function(node) {
      return node.nodeName === 'FIGCAPTION' && 
             node.classList.contains('figcaption') &&
             node.previousElementSibling &&
             node.previousElementSibling.getAttribute('data-type') === 'grid';
    },
    replacement: function() {
      return '';
    }
  });

}