function setupLetterSpacingControls(span) {
  span.addEventListener("wheel", (e) => {
    e.preventDefault();
    let currentValue = parseInt(span.style.getPropertyValue("--ls")) || 0;
    const step = e.shiftKey ? 10 : 1;
    
    if (e.deltaY < 0) {
      currentValue += step;
    } else {
      currentValue -= step;
    }
    
    span.style.setProperty("--ls", currentValue.toString());
  });
  
  span.addEventListener("mouseenter", () => {
    span.style.cursor = "ns-resize";
  });
}

function toggleLetterSpacing() {
  const input = document.querySelector(".ls-input");
  const value = input?.value || "0";
  
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const span = document.createElement("span");
  span.className = "editor-add";
  span.setAttribute("data-timestamp", Date.now());
  span.style.setProperty("--ls", value);
  span.setAttribute("tabindex", "0");
  
  setupLetterSpacingControls(span);
  
  try {
    selection.getRangeAt(0).surroundContents(span);
  } catch (e) {
    span.textContent = selection.getRangeAt(0).toString();
    selection.getRangeAt(0).deleteContents();
    selection.getRangeAt(0).insertNode(span);
  }
}

export function letterSpacing(actionRegistry) {
  actionRegistry.add("letter-spacing", {
    type: "toggle",
    icon: "A ↔ A", 
    title: "Lettrage (Letter-spacing)",
    execute: () => toggleLetterSpacing(),
    isActive: (element) => {
      let current = element;
      while (current && current !== document.body) {
        if (current.tagName === "SPAN" && 
            current.style.getPropertyValue("--ls") !== "") {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    },
  });
}