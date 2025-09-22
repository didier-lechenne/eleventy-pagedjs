export function exportMd(actionRegistry) {
  actionRegistry.add("export-md", {
    type: "utility",
    icon: `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV4dGVybmFsLWxpbmstaWNvbiI+PHBhdGggZD0ibTE1IDNINWEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTRhMiAyIDAgMCAwIDItMlY5Ii8+PHBhdGggZD0ibTEwIDE0IDItMm0yLTIgMi0yIDItMiIvPjxwYXRoIGQ9Im0xNSAzIDYgNi0xIDEtNi02IDEtMVoiLz48L3N2Zz4=" style="width: 16px; height: 16px; filter: invert(1);" alt="Export">`,
    title: "Exporter par plage de pages",
    execute: (editor) => {
      if (editor.commands.exportMarkdownByRange) {
        editor.commands.exportMarkdownByRange();
      } else {
        console.warn("Méthode exportMarkdownByRange non disponible dans commands.js");
      }
    },
  });
}