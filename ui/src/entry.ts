import type { VinicuncaOptions } from './init';

import * as components from './components';
import { initVinicunca } from './init';

export const createVinicunca = (options: VinicuncaOptions = {}) => {
  return initVinicunca({ components, ...options });
};

export {
  components,
};
