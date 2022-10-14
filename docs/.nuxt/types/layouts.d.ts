import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/Users/praburangki/Dev/@vinicunca/unocss-scan-reproduce/node_modules/.pnpm/nuxt@3.0.0-rc.11/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}