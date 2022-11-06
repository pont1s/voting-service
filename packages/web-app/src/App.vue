<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useInitialStore } from '@/stores/initialStore';

import AppProvider from '@/AppProvider.vue';
import NoWalletDetected from '@/views/NoWalletDetected.vue';
import { useLayoutController } from '@/hooks/useLayoutController';

const route = useRoute();

const initialStore = useInitialStore();

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

initialStore.$patch({
  isMobileVersion: window.innerWidth < 927,
});

window.addEventListener('resize', () => {
  if (window.innerWidth < 927) {
    initialStore.$patch({
      isMobileVersion: true,
    });
  } else {
    initialStore.$patch({
      isMobileVersion: false,
    });
  }
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const isMetaMaskDetected = computed(() => window.ethereum !== undefined);

const { layout } = useLayoutController(route);
</script>

<template>
  <app-provider v-if="isMetaMaskDetected">
    <component :is="layout" />
  </app-provider>
  <no-wallet-detected v-else />
</template>

<style lang="scss">
@import 'styles/index';

#app {
  height: calc(var(--vh, 1vh) * 100);

  @media (min-width: 927px) {
    --padding-containter: 1.5rem;
    height: 100%;
  }
}

.n-config-provider {
  height: 100%;

  @media (max-width: 926px) {
    height: calc(var(--vh, 1vh) * 100);
  }
}
</style>
