export function reset(actionRegistry) {
  actionRegistry.add("reset", {
    type: "utility",
    icon: "⟲", 
    title: "Annuler dernière transformation",
    execute: (editor) => {
      if (editor.commands.undoLastTransformation) {
        // console.log("Calling undoLastTransformation...");
        editor.commands.undoLastTransformation();
      } else {
        console.warn("Méthode undoLastTransformation non disponible dans commands.js");
      }
    },
  });
}