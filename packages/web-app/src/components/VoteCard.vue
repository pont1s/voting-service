<script lang="ts" setup>
interface VoteCardProps {
  title: string
}

const props = defineProps<VoteCardProps>();
</script>

<template>
  <div class="vote-card">
    <div class="vote-card-image">
      <div class="vote-card-image-empty" />
    </div>
    <h3 class="vote-card-title">{{ props.title }}</h3>
  </div>
</template>

<style lang="scss" scoped>
.vote-card {
  user-select: none;
  cursor: pointer;
  transition: transform ease-out .1s;

  &:hover {
    transform: scale(0.95);
  }

  .vote-card-image {
    .vote-card-image-empty {
      width: 300px;
      height: 220px;
      border-radius: 0.5rem;
      background: linear-gradient(60.84deg, #608CFF -5.07%, #9C9AFD 102.37%);
    }
  }

  .vote-card-title {
    margin-top: 1rem;
  }
}
</style>
