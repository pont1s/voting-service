<script lang="ts" setup>
import VIcon from '@/components/kit/VIcon.vue';
import { computed } from 'vue';

const props = defineProps({
  routeName: {
    type: String,
    required: true,
  },
  activeRouteName: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
});

const isActive = computed(() => props.routeName === props.activeRouteName);
</script>

<template>
  <router-link :to="{ name: props.routeName }">
    <div class="navbar-item" :class="[{ 'active': isActive }]">
      <VIcon
        class="navbar-icon"
        :name="props.iconName"
        :size="24"
      />
      <span class="navbar-title">
        {{ props.title }}
      </span>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.navbar-item {
  color: #979AA5;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  border-radius: var(--border-radius-default-large);
  transition: color, background-color ease-in-out .2s;

  .navbar-icon {
    :deep(use) {
      transition: fill ease-in-out .2s;
    }
  }

  &.active {
    color: var(--color-primary);

    .navbar-icon {
      :deep(use) {
        fill: var(--color-primary);
      }
    }
  }

  @media (min-width: 927px) {
    flex-direction: row;
    gap: 1rem;
    padding: 0.75rem 1rem;

    &:hover {
      color: var(--color-primary);
      .navbar-icon {
        :deep(use) {
          fill: var(--color-primary);
        }
      }
    }

    &.active {
      background-color: var(--color-primary);

      color: #fff;
      .navbar-icon {
        :deep(use) {
          fill: #fff;
        }
      }
    }
  }

  .navbar-icon {
    :deep(use) {
      fill: #979AA5;
    }
  }

  .navbar-title {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;

    @media (min-width: 927px) {
      font-size: 1rem;
      line-height: 1.25rem;
      font-weight: 400;
    }
  }
}
</style>
