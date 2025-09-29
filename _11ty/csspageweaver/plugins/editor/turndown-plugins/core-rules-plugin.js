export function coreRulesPlugin(turndownService) {
  turndownService.keep([
    function (node) {
      return node.nodeName === "SPAN" && node.style.getPropertyValue("--ls");
    },
    "sup",
    "sub",
  ]);



 
  var originalEscape = turndownService.escape;

  turndownService.escape = function (string) {
    
    string = originalEscape.call(this, string);

   
    var customEscapes = [
      [/\[\[/g, "\\[\\["],
      [/\]\]/g, "\\]\\]"],
    ];

    return customEscapes.reduce(function (accumulator, escape) {
      return accumulator.replace(escape[0], escape[1]);
    }, string);
  };



  // turndownService.addRule("blockquote", {
  //   filter: 'blockquote',
  //   replacement: function (content) {
  //     content = content.trim();
  //     return '\n\n> ' + content.replace(/\n/g, '\n> ') + '\n\n';
  //   }
  // });
}
