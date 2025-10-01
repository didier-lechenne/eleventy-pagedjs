import { UNICODE_CHARS } from "./unicode.js";

/**
 * @name ACTIONS_REGISTRY
 * @description Registre centralisé de toutes les actions disponibles dans l'éditeur
 */

  class ActionRegistry {
    constructor() {
      this.actions = new Map();
    }

    add(id, config) {
      this.actions.set(id, config);
    }

    get(id) {
      return this.actions.get(id);
    }

    has(id) {
      return this.actions.has(id);
    }

    entries() {
      return Array.from(this.actions.entries());
    }

    async loadPlugins() {
      try {
        const plugins = await import('./actions/index.js');
        Object.values(plugins).forEach(plugin => {
          if (typeof plugin === 'function') {
            plugin(this);
          }
        });
      } catch (error) {
        console.warn('Plugins non trouvés ou erreur de chargement:', error);
      }
    }
  }

  export const ACTIONS_REGISTRY = new ActionRegistry();

/**
 * Fonctions utilitaires
 */

export function getActionsByType(type) {
  return ACTIONS_REGISTRY.entries()
    .filter(([_, config]) => config.type === type)
    .reduce((acc, [id, config]) => ({ ...acc, [id]: config }), {});
}

export function isValidAction(actionId) {
  return ACTIONS_REGISTRY.has(actionId);
}

export function executeAction(actionId, editor, value = null) {
  const action = ACTIONS_REGISTRY.get(actionId);
  if (!action) {
    console.warn(`Action inconnue: ${actionId}`);
    return false;
  }

  try {
    if (action.type === 'toggle-select' && value) {
      const option = action.options.find(opt => opt.value === value);
      if (option?.execute) {
        option.execute(editor);
      }
    } else {
      action.execute(editor, value);
    }
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de l'action ${actionId}:`, error);
    return false;
  }
}
