import type { ComponentPublicInstance, FunctionalComponent, VNodeChild } from 'vue';

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      $children: {};
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}

declare module '@vue/runtime-dom' {
  export interface HTMLAttributes {
    $children?: VNodeChild;
  }
  export interface SVGAttributes {
    $children?: VNodeChild;
  }
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // @generate-components
  }
}
