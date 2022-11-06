<script lang="ts" setup>
import { computed, PropType } from 'vue';

const props = defineProps({
  type: {
    type: String as PropType<'default' | 'danger'>,
    default: 'default',
  },
  size: {
    type: [String, Number] as PropType<number | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  fontSize: {
    type: Number,
    default: 1,
  },
  fontWeight: {
    type: Number,
    default: 500,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const typeValue = computed(() => props.type);
const disabledValue = computed(() => (props.disabled ? 'disabled' : ''));
const fontSize = computed(() => props.fontSize);
const fontWeight = computed(() => props.fontWeight);

const sizeCalculate = (size: string | number) => {
  if (size === 'medium') {
    return 2.75;
  }
  if (size === 'small') {
    return 2;
  }
  return 3.5;
};

const sizeValue = computed(() => {
  if (typeof props.size === 'number') {
    return props.size;
  }
  return sizeCalculate(props.size);
});

const buttonMenuStyle = computed(() => ({
  height: `${sizeValue.value}rem`,
  fontSize: fontSize.value,
  fontWeight: fontWeight.value,
  borderRadiusRound: `${sizeValue.value}rem`,
}));
</script>

<template>
  <button
    class="v-button-menu-base"
    :class="[typeValue, disabledValue]"
    :style="{ fontSize: `${buttonMenuStyle.fontSize}rem`, fontWeight: buttonMenuStyle.fontWeight }"
  >
    <span class="v-button-menu-icon">
      <slot name="icon" />
    </span>
    <span class="v-button-menu-text">
      <slot name="default" />
    </span>
    <span class="v-button-menu-right">
      <slot name="right" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.v-button-menu-base {
  height: v-bind('buttonMenuStyle.height');
  position: relative;
  width: auto;
  display: inline-flex;
  flex-wrap: nowrap;
  flex-shrink: 1;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  line-height: var(--default-line-height);
  outline: none;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  user-select: none;
  border: none;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem;
  border-radius: var(--border-radius-default-tiny);
  font-weight: 400;
  font-family: unset;
  transition: color .2s ease, transform .15s ease-in-out;
  background-color: transparent;
  color: var(--color-text);

  &:hover {
    background-color: var(--color-background-compact-menu-hover);
  }

  &:active {
    transform: scale(0.98);
  }

  &.danger {
    color: var(--color-error-shade);
  }

  .v-button-menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    :slotted(svg) {
      margin-right: 1.25rem;
    }
  }

  .v-button-menu-text {
    user-select: none;
    pointer-events: none;
    line-height: var(--default-line-height);
  }

  .v-button-menu-right {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
}
</style>
