import { defineComponent } from 'vue';

export const VButton = defineComponent({
  name: 'VButton',

  setup(_, { slots }) {
    return () => (
      <button class="bg-red-500">
        { slots.default?.() }
      </button>
    )
  },
});

export type VButton = InstanceType<typeof VButton>;
