<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import VIcon from '@/components/kit/VIcon.vue';
import VButton from '@/components/kit/VButton.vue';

const props = defineProps({
  value: {
    type: [Number, null] as PropType<number | null>,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  styleType: {
    type: String as PropType<'default' | 'form'>,
    default: 'default',
  },
  size: {
    type: [String, Number],
    default: 'medium',
  },
  round: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  messages: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
});
const emit = defineEmits(['update:value', 'focus']);
const placeHolderValue = computed(() => props.placeholder);
const inputTypeValue = computed(() => `v-input-container-${props.styleType}`);
const isInputTouched = computed(() => props.value !== null);
const roundValue = computed(() => (props.round ? 'round' : ''));
const isInputFocus = ref(false);
const inputRef = ref<null | HTMLInputElement>(null);
const isMessagesNotEmpty = computed(() => props.messages.length !== 0);
const messagesContainerHeight = computed(() => `${props.messages.length
+ props.messages.length * 0.125}rem`);
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
const inputStyle = computed(() => ({
  height: sizeValue.value,
  borderRadiusRound: `${sizeValue.value}rem`,
}));
const labelStyle = computed(() => ({
  top: `${sizeValue.value / 2 - 0.75}rem`,
  topAfterFocus: `-${0.8}rem`,
  transform: `scale(0.7) translate(0, -${(sizeValue.value / 2)}rem)`,
}));
const onClickClearHandler = () => {
  emit('update:value', null);
};
const onClick = () => {
  if (!isInputFocus.value && inputRef.value !== null) {
    inputRef.value.focus();
    isInputFocus.value = true;
  }
};
const onFocusOut = (e: Event) => {
  if (e.target !== document.activeElement) {
    isInputFocus.value = false;
  }
};
const onInput = (e: Event) => {
  const inputValue = Number.parseInt((e.target as HTMLInputElement).value, 10);
  if (inputValue > props.min) {
    emit('update:value', inputValue);
  } else {
    emit('update:value', props.min);
  }
};
const onFocus = () => {
  if (!isInputFocus.value && inputRef.value !== null) {
    inputRef.value.focus();
    isInputFocus.value = true;
  }
  emit('focus');
};
const root = document.querySelector(':root');
const clearIconFillColor = ref('black');
if (root) {
  const rootStyle = getComputedStyle(root);
  clearIconFillColor.value = rootStyle.getPropertyValue('--color-icon-secondary');
}
</script>

<template>
  <div class="v-input-container-base" :class="[inputTypeValue]">
    <div
      ref="inputFieldRef"
      class="v-input-field"
      :class="[ { 'touched': isInputTouched, 'focus': isInputFocus }, roundValue ]"
      @click="onClick"
    >
      <div class="prefix">
        <slot name="prefix" />
      </div>
      <div class="v-input-content">
        <input
          ref="inputRef"
          class="v-input"
          type="number"
          :min="props.min"
          :class="{ 'touched': isInputTouched }"
          :style="{ height: inputStyle.height + 'rem' }"
          :value="value"
          @input="onInput"
          @focus="onFocus"
          @blur="onFocusOut"
        >
        <label class="v-input-label">{{ placeHolderValue }}</label>
      </div>
      <div class="v-input-actions">
        <div v-if="props.value" class="clearable">
          <v-button
            quaternary
            circle
            @click="onClickClearHandler"
          >
            <template #icon>
              <v-icon
                name="x"
                :fill="clearIconFillColor"
                :size="24"
              />
            </template>
          </v-button>
        </div>
      </div>
      <div class="suffix">
        <slot name="suffix" />
      </div>
    </div>
    <TransitionGroup
      name="messages"
      tag="div"
      class="v-input-messages"
      :class="{ 'notEmpty': isMessagesNotEmpty }"
    >
      <div
        v-for="(message, index) in props.messages"
        :key="index"
      >
        {{ message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.v-input-container-base {
  width: 100%;
  --border-width: 1px;
  .v-input-field {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: text;
    padding: 0 0.4rem 0 calc(0.8rem - var(--border-width));
    &.focus {
      caret-color: var(--color-primary);
    }
    .v-input-content {
      position: relative;
      width: 100%;
      .v-input {
        display: block;
        width: 100%;
        font-size: 1rem;
        word-break: break-word;
        -webkit-appearance: none;
        outline: none;
        line-height: var(--default-line-height);
        padding: 0 0.4rem;
        border: none;
        border-radius: 0;
        background-color: transparent;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
      .v-input-label {
        display: block;
        position: absolute;
        left: 0.2rem;
        top: v-bind('labelStyle.top');
        padding: 0 0.2rem;
        font-size: 1rem;
        font-weight: 400;
        cursor: text;
        pointer-events: none;
        transform-origin: left center;
        white-space: nowrap;
        line-height: var(--default-line-height);
      }
    }
    .suffix,
    .prefix,
    .clearable {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .v-input-messages {
    margin-top: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    color: var(--color-error);
    transition: height .2s ease-out;
    height: 0;
    min-height: 0;
    &.notEmpty {
      height: v-bind(messagesContainerHeight);
      min-height: unset;
    }
  }
  .messages-enter-active,
  .messages-leave-active {
    transition: all .2s ease;
  }
  .messages-enter-from,
  .messages-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
.v-input-container-default {
  .v-input-field {
    border-radius: var(--border-radius-default);
    background-color: var(--color-chat-hover);
    .v-input-content {
      .v-input-label {
        color: var(--color-placeholders);
        transition: top .15s ease-out, transform .15s ease-out, color .15s ease-out;
      }
      &.touched label,
      .v-input.touched + label {
        display: none;
      }
    }
  }
}
.v-input-container-form {
  .v-input-field {
    border-radius: var(--border-radius-default);
    border: var(--border-width) solid var(--color-borders-input);
    background-color: var(--color-background);
    transition: border-color .15s ease, box-shadow .1s ease;
    &:hover {
      border-color: var(--color-primary);
    }
    &.focus {
      border-color: var(--color-primary);
      box-shadow: inset 0 0 0 1px var(--color-primary);
    }
    .v-input-content {
      .v-input {
        color: var(--color-text);
      }
      .v-input-label {
        background-color: var(--color-background);
        border: none;
        color: var(--color-placeholders);
        transition: top .15s ease-out, transform .15s ease-out, color .15s ease-out;
      }
      &.touched label,
      .v-input:focus + label,
      .v-input.touched + label {
        top: v-bind('labelStyle.topAfterFocus');
        transform: scale(0.8);
        color: var(--color-text-secondary);
      }
      .v-input:focus + label {
        color: var(--color-primary);
      }
    }
    &:hover {
      .v-input-content {
        .v-input + label {
          color: var(--color-primary);
        }
      }
    }
  }
}
.v-input-container-search {
  .v-input-field {
    border-radius: var(--border-radius-default);
    background-color: var(--color-chat-hover);
    &.focus {
      box-shadow: inset 0 0 0 2px var(--color-primary);
    }
    .v-input-content {
      .v-input-label {
        color: var(--color-placeholders);
        transition: top .15s ease-out, transform .15s ease-out, color .15s ease-out;
      }
      &.touched label,
      .v-input.touched + label {
        display: none;
      }
    }
  }
}
.v-input-container-base {
  .v-input-field {
    &.round {
      border-radius: v-bind('inputStyle.borderRadiusRound');
    }
  }
}
</style>
