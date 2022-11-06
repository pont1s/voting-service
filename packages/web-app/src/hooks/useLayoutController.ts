import {
  DefineComponent, markRaw, ref, watch,
} from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export const useLayoutController = (route: RouteLocationNormalizedLoaded) => {
  const layout = ref<DefineComponent>();

  const getLayout = async (layoutName: string) => {
    const layoutComponent = (await import(`./../layouts/${layoutName}.vue`)) as { default: DefineComponent };
    return layoutComponent.default;
  };

  watch(() => route.meta, async (meta) => {
    try {
      layout.value = markRaw(await getLayout(meta.layout as string));
    } catch (e) {
      console.warn('%c Use AppLayoutDefault instead.\n', 'color: darkturquoise', e);
      layout.value = markRaw(await getLayout('DefaultLayout'));
    }
  });

  return {
    layout,
  };
};
