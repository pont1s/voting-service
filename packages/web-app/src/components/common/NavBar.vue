<script lang="ts" setup>
import { useRoute } from 'vue-router';

import NavBarItem from '@/components/common/navbar/NavBarItem.vue';
import { useInitialStore } from '@/stores/initialStore';
import VIcon from '@/components/kit/VIcon.vue';
import { useChangeColorSchema } from '@/hooks/useChangeColorSchema';
import { computed, onMounted } from 'vue';

const route = useRoute();

const routeName = computed(() => route.name as string | undefined);

const initialStore = useInitialStore();

const colorSchemas = [
  { name: 'shiki-light', label: 'Светлая тема' },
  { name: 'shiki-dark', label: 'Темная тема' },
];

const disabledColorSchema = computed(() => colorSchemas
  .find((schema) => schema.name !== initialStore.activeColorSchema));

let applyColorSchema: (schemaName: string) => void;
onMounted(async () => {
  applyColorSchema = (await useChangeColorSchema()).applyColorSchema;
  applyColorSchema(initialStore.activeColorSchema);
});
const changeColorSchemaClickHandler = (schemaName: string | undefined) => {
  if (applyColorSchema && schemaName) {
    applyColorSchema(schemaName);
    initialStore.saveColorSchema(schemaName);
  }
};
</script>

<template>
  <aside class="nav-bar">
    <div class="nav-bar-up-content">
      <div v-if="!initialStore.isMobileVersion" class="logo">
        <VIcon name="logo-light" :size="48" />
        <span>shikireki</span>
      </div>
      <span v-if="!initialStore.isMobileVersion" class="nav-bar-items-title">Меню</span>
      <div class="nav-bar-items">
        <nav-bar-item
          route-name="votes"
          active-route-name="votes"
          icon-name="search"
          title="Голосования"
        />
      </div>
    </div>
    <div
      v-if="!initialStore.isMobileVersion"
      class="nav-bar-up-content-down-content"
      @click="changeColorSchemaClickHandler(disabledColorSchema?.name)"
    >
      <VIcon name="sun" :size="24" />
      <span>{{ disabledColorSchema?.label }}</span>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.625rem 1rem;
  justify-content: space-between;
  border-top: #ECEFF6 solid 1px;
  background-color: var(--color-background);

  @media (min-width: 927px) {
    max-width: 270px;
    padding: var(--padding-containter);
    border-top: none;
    border-right: #ECEFF6 solid 1px;

    .nav-bar-up-content {
      display: flex;
      flex-direction: column;

      .nav-bar-items {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-bar-items-title {
        margin-top: 4.375rem;
        font-size: 1.125rem;
        font-weight: 500;
        margin-left: 1rem;
      }

      .nav-bar-items {
        margin-top: 1.5rem;
      }
    }
  }

  .nav-bar-up-content {
    .logo {
      display: flex;
      gap: 0.75rem;
      align-items: center;

      span {
        font-size: 1.375rem;
        font-weight: 500;
      }
    }

    .nav-bar-items {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
  }

  .nav-bar-up-content-down-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    color: #979AA5;
    cursor: pointer;
    user-select: none;
    transition: color ease-in-out .2s;

    :deep(use) {
      fill: #979AA5;
      transition: fill ease-in-out .2s;
    }

    &:hover {
      color: var(--color-primary);

      :deep(use) {
        fill: var(--color-primary);
      }
    }
  }
}
</style>
