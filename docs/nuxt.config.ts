import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],

  unocss: {
    include: [
      '/\.js$/',
      '/\.mjs$/',
      /\/vinicunca\/lib/,
    ],
  },

  content: {
    documentDriven: true,
  },
});
