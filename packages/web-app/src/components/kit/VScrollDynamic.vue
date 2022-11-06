<script lang="ts" setup>
import { NScrollbar } from 'naive-ui';
import { debounce } from '@/utils/schedulers';
import { PropType } from 'vue';

const props = defineProps({
  listItemsElements: {
    type: [Object] as PropType<
    Array<{ chats: unknown[],
      nextCursor?: number, prevCursor?: number }> | undefined
    >,
    default: undefined,
  },
  containerRef: {
    type: [Object] as PropType<HTMLDivElement | undefined>,
    default: undefined,
  },
  hasTopData: {
    type: Boolean,
    default: false,
  },
  hasBottomData: {
    type: Boolean,
    default: false,
  },
  isTopDeleting: {
    type: Boolean,
    required: true,
  },
  isBottomDeleting: {
    type: Boolean,
    required: true,
  },
  isFetchingNextPage: {
    type: Boolean,
    required: true,
  },
  isFetchingPreviousPage: {
    type: Boolean,
    required: true,
  },
  offsetBeforeLoading: {
    type: Number,
    default: 300,
  },
  onBottomAddHandler: {
    type: Function as PropType<(...args: unknown[]) => void>,
    required: true,
  },
  onBottomDeleteHandler: {
    type: Function as PropType<(...args: unknown[]) => void>,
    required: true,
  },
  onTopAddHandler: {
    type: Function as PropType<(...args: unknown[]) => void>,
    required: true,
  },
  onTopDeleteHandler: {
    type: Function as PropType<(...args: unknown[]) => void>,
    required: true,
  },
});

const onScrollEventHandler = (e: Event) => {
  const target = e.target as HTMLElement;
  // console.log(`ContainerScrollHeight: ${target.scrollHeight}`);
  // console.log(`ContainerViewPort: ${target.offsetHeight}`);
  // console.log(`Current Scroll position: ${target.scrollTop}`);
  if (target) {
    if (Math.ceil(target.scrollTop) + props.offsetBeforeLoading
      >= target.scrollHeight - target.offsetHeight
      && props.hasBottomData && !props.isFetchingNextPage) {
      props.onBottomAddHandler();

      if (props.isTopDeleting && props.listItemsElements && props.containerRef) {
        const listLength = props.listItemsElements.at(0)?.chats?.length;
        debounce(() => {
          props.onTopDeleteHandler();
          const scrollOffset = target.scrollHeight - (target.scrollTop + target.offsetHeight);
          target.scrollTo({
            top: target.scrollHeight - scrollOffset - (70 * 20) - target.offsetHeight,
          });
        }, 200, false, true)();
      }
    }

    if (Math.ceil(target.scrollTop) <= props.offsetBeforeLoading && props.hasTopData && !props.isFetchingPreviousPage) {
      props.onTopAddHandler();
      target.scrollTo({
        top: target.scrollTop + (70 * 20),
      });

      if (props.isBottomDeleting) {
        debounce(() => {
          props.onBottomDeleteHandler();
        }, 200, false, true)();
      }
    }
  }
};
</script>

<template>
  <div class="v-scroll-dynamic">
    <n-scrollbar @scroll="onScrollEventHandler">
      <slot />
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.v-scroll-dynamic {
  overflow: hidden;
  height: 100%;

  :deep(.n-scrollbar) {
    pointer-events: auto;
    overflow-y: auto;

    //user-select: none;
    //-ms-overflow-style: none;
    //scrollbar-width: none;
    //
    //&::-webkit-scrollbar {
    //  width: 0;
    //  height: 0;
    //  background: transparent;
    //}

    .n-scrollbar-rail {
      display: none;
      right: 0;
    }

    .n-scrollbar-content {
      display: flex;
      min-height: 100%;
    }
  }
}
</style>
