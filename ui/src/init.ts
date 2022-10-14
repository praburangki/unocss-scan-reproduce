import type { App } from 'vue';

export interface VinicuncaOptions {
  components?: Record<string, any>;
}

export function initVinicunca(vinicunca: VinicuncaOptions = {}) {
  const {
    components = {},
  } = vinicunca;

  function install(app: App) {
    for (const key in components) {
      app.component(key, components[key]);
    }
  }

  return {
    install,
  };
}
