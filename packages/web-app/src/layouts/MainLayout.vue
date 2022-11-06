<script lang="ts" setup>
import NavBar from '@/components/common/NavBar.vue';
</script>

<template>
  <div class="main-layout">
    <nav-bar class="nav-bar" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column-reverse;

  @media (min-width: 927px) {
    height: 100%;
    flex-direction: row;
  }

  main {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
