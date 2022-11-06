<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useGetCSSVariable } from '@/hooks/useCssVariables';

import VIconImport from '@/components/kit/VIconImport/VIconImport.vue';
import { useInitialStore } from '@/stores/initialStore';

const initialStore = useInitialStore();

const colorIcons = useGetCSSVariable('--color-primary');

const scrollableContainer = ref<null | HTMLDivElement>(null);
const containerScrollLeft = ref(0);
const isContainerScrollInEnd = ref(false);

const isScrollableContainerScrolled = computed(
  () => scrollableContainer.value?.offsetWidth !== scrollableContainer.value?.scrollWidth,
);

const isPrevButtonVisible = computed(() => (!initialStore.isMobileVersion
&& containerScrollLeft.value > 0) && isScrollableContainerScrolled);
const isNextButtonVisible = computed(() => (!initialStore.isMobileVersion
&& !isContainerScrollInEnd.value) && isScrollableContainerScrolled);

const childrenGap = 20;
const onClickPrevButtonHandler = () => {
  if (scrollableContainer.value) {
    const containerChildren = scrollableContainer.value.children[0] as HTMLDivElement;
    if (containerChildren) {
      const currentCard = scrollableContainer.value.children.length
        - Math.ceil((scrollableContainer.value.scrollWidth - scrollableContainer.value.scrollLeft)
          / (containerChildren.offsetWidth + childrenGap + 4)) + 1;
      const cardsVisible = Math.floor(
        (scrollableContainer.value.offsetWidth - 24) / (containerChildren.offsetWidth + childrenGap),
      );

      const nextCardScrollOffset = scrollableContainer.value.scrollLeft
        - (currentCard - cardsVisible) * (containerChildren.offsetWidth + childrenGap);

      if (scrollableContainer.value.scrollLeft - nextCardScrollOffset > 0) {
        scrollableContainer.value.scrollTo({
          left: scrollableContainer.value.scrollLeft - nextCardScrollOffset - 4,
          behavior: 'smooth',
        });
      } else {
        scrollableContainer.value.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }
};

const onClickNextButtonHandler = () => {
  if (scrollableContainer.value) {
    const containerChildren = scrollableContainer.value.children[0] as HTMLDivElement;
    if (containerChildren) {
      const maxContainerScroll = scrollableContainer.value.scrollWidth - scrollableContainer.value.offsetWidth;
      const currentCard = scrollableContainer.value.children.length
        - Math.ceil((scrollableContainer.value.scrollWidth - scrollableContainer.value.scrollLeft)
          / (containerChildren.offsetWidth + childrenGap + 4));

      const cardsVisible = Math.floor(
        (scrollableContainer.value.offsetWidth - 24) / (containerChildren.offsetWidth + childrenGap),
      );

      const nextCardScrollOffset = (currentCard + cardsVisible) * (containerChildren.offsetWidth + childrenGap)
        - scrollableContainer.value.scrollLeft;

      if (scrollableContainer.value.scrollLeft + nextCardScrollOffset < maxContainerScroll) {
        scrollableContainer.value.scrollTo({
          left: scrollableContainer.value.scrollLeft + nextCardScrollOffset + 4,
          behavior: 'smooth',
        });
      } else {
        scrollableContainer.value.scrollTo({
          left: maxContainerScroll,
          behavior: 'smooth',
        });
      }
    }
  }
};

const onScrollContainerHandler = (e: Event) => {
  const container = e.target as HTMLDivElement;
  containerScrollLeft.value = container.scrollLeft;
  isContainerScrollInEnd.value = container.scrollLeft + container.offsetWidth === container.scrollWidth;
};

const isDragActive = ref(false);
let startX = 0;
let scrollLeft = 0;
let interval = 0;

const onMouseDownContainerHandler = (e: MouseEvent) => {
  interval = window.setTimeout(() => {
    if (scrollableContainer.value) {
      isDragActive.value = true;
      startX = e.pageX - scrollableContainer.value.offsetLeft;
      scrollLeft = scrollableContainer.value.scrollLeft;
    }
  }, 90);
};

const onMouseMoveContainerHandler = (e: MouseEvent) => {
  if (isDragActive.value && scrollableContainer.value) {
    const x = e.pageX - scrollableContainer.value.offsetLeft;
    const walk = (x - startX) * 2;

    scrollableContainer.value.scrollLeft = scrollLeft - walk;
  }
};

const onMouseUpContainerHandler = () => {
  isDragActive.value = false;
  window.clearInterval(interval);
};
</script>

<template>
  <div class="horizontal-container">
    <div
      v-if="isPrevButtonVisible"
      class="nav-button prev-button"
      @click="onClickPrevButtonHandler"
    >
      <v-icon-import
        class="nav-button-icon"
        name="chevron"
        :size="26"
        fill="#D3D3D3"
      />
    </div>
    <div
      ref="scrollableContainer"
      class="scrollable-container"
      :class="[{ 'drag-active': isDragActive }]"
      @scroll="onScrollContainerHandler"
      @mousedown="onMouseDownContainerHandler"
      @mouseup="onMouseUpContainerHandler"
      @mousemove="onMouseMoveContainerHandler"
    >
      <slot class="slot-content" />
    </div>
    <div
      v-if="isNextButtonVisible"
      class="nav-button next-button"
      @click="onClickNextButtonHandler"
    >
      <v-icon-import
        class="nav-button-icon"
        name="chevron"
        :size="26"
        fill="#D3D3D3"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-container {
  display: flex;
  position: relative;

  .nav-button {
    position: absolute;
    z-index: 5;
    top: calc(50% - 50px);
    left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    min-width: 50px;
    background-color: var(--color-background);
    box-shadow: 0 6px 40px 30px rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    cursor: pointer;
    user-select: none;

    :deep(.nav-button-icon) {
      svg {
        transition: fill ease-out .1s;
      }
    }

    &:hover {
      :deep(.nav-button-icon) {
        svg {
          fill: var(--color-primary);
        }
      }
    }

    &.prev-button {
      transform: rotate(180deg);
    }

    &.next-button {
      right: 0.5rem;
      left: unset;
    }
  }

  .scrollable-container {
    display: flex;
    overflow-x: scroll;
    -ms-overflow-style: none;
    padding: 1rem 0;
    user-select: none;
    transition: transform ease-out .1s;

    &.drag-active {
      cursor: grabbing;
      transform: scale(0.99);

      :deep(*) {
        cursor: grabbing;
        pointer-events: none;
      }
    }

    &:not(.drag-active) {
      scroll-behavior: smooth;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }

    :deep(> div) {
      margin-right: 0.75rem;

      @media (min-width: 927px) {
        margin-right: 1.25rem;
      }
    }

    :deep(> div:first-child) {
      margin-left: var(--padding-containter);
    }

    :deep(> div:last-child) {
      margin-right: var(--padding-containter);
    }
  }
}
</style>
