<script lang="ts" setup>
import VoteCard from '@/components/VoteCard.vue';
</script>

<template>
  <div class="votes">
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
    <vote-card title="Голосование один" />
  </div>
</template>

<style lang="scss" scoped>
.votes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
