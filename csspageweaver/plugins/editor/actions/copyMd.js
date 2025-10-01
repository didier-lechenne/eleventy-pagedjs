export function copyMd(actionRegistry) {
  actionRegistry.add("copy-md", {
    type: "utility",
    icon: `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsaXBib2FyZC1jb3B5LWljb24gbHVjaWRlLWNsaXBib2FyZC1jb3B5Ij48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSI4IiB5PSIyIiByeD0iMSIgcnk9IjEiLz48cGF0aCBkPSJNOCA0SDZhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJ2LTIiLz48cGF0aCBkPSJNMTYgNGgyYTIgMiAwIDAgMSAyIDJ2NCIvPjxwYXRoIGQ9Ik0yMSAxNEgxMSIvPjxwYXRoIGQ9Im0xNSAxMC00IDQgNCA0Ii8+PC9zdmc+" style="width: 16px; height: 16px; filter: invert(1);" alt="Copy">`,
    title: "Copier l'élément en Markdown",
    execute: (editor) => {
      if (editor.commands.copyElementAsMarkdown) {
        editor.commands.copyElementAsMarkdown();
      } else {
        console.warn("Méthode copyElementAsMarkdown non disponible dans commands.js");
      }
    },
  });
}