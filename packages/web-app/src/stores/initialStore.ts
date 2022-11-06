import { onMounted, ref } from 'vue';
import { defineStore } from 'pinia';

export const useInitialStore = defineStore('initialStore', () => {
  const isMobileVersion = ref(false);
  const activeColorSchema = ref('shiki-light');

  onMounted(() => {
    const colorSchema = localStorage.getItem('color-schema');
    if (colorSchema) {
      activeColorSchema.value = colorSchema;
    }
  });

  const saveColorSchema = (schemaName: string) => {
    activeColorSchema.value = schemaName;
    localStorage.setItem('color-schema', schemaName);
  };

  return {
    isMobileVersion,
    activeColorSchema,
    saveColorSchema,
  };
});
