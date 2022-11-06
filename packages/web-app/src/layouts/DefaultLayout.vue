<script lang="ts" setup>
</script>

<template>
  <div class="default-layout">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  height: calc(var(--vh, 1vh) * 100);
}
</style>
