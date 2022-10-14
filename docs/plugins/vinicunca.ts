import { initVinicunca } from 'vinicunca';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((plugin) => {
  const vinicunca = initVinicunca({});

  plugin.vueApp.use(vinicunca);
});
