export default function invisibleSpacesEvents() {
    const STORAGE_KEY = 'invisibleSpaces';
    
    let body = cssPageWeaver.ui.body;
    let toggleInput = cssPageWeaver.ui.invisibleSpaces.toggleInput;
    
    function saveState(enabled) {
        try {
            localStorage.setItem(STORAGE_KEY, enabled.toString());
        } catch (error) {
            console.warn('[invisibleSpaces] Could not save to localStorage:', error);
        }
    }
    
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved !== null ? saved === 'true' : true; // true si jamais sauvegardé
    } catch (error) {
        console.warn('[invisibleSpaces] Could not load from localStorage:', error);
        return true;
    }
}
    
    function applyState(enabled) {
        body.setAttribute('data-invisible-spaces', enabled);
        toggleInput.checked = enabled;
    }
    
    const savedState = loadState();
    applyState(savedState);
    
    toggleInput.addEventListener("input", async (e) => {
        const enabled = e.target.checked;
        applyState(enabled);
        saveState(enabled);
        
        
        console.log('[invisibleSpaces] État:', enabled ? 'activé' : 'désactivé');
    });
}