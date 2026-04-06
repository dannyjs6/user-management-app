<template>
  <div :class="spinnerClasses">
    <div class="loading-spinner__inner"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white'
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  inline: false
})

const spinnerClasses = computed(() => {
  return [
    'loading-spinner',
    `loading-spinner--${props.size}`,
    `loading-spinner--${props.color}`,
    {
      'loading-spinner--inline': props.inline
    }
  ]
})
</script>

<style scoped lang="scss">
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;

  &--inline {
    display: inline-flex;
  }

  &__inner {
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &--sm &__inner {
    width: 1rem;
    height: 1rem;
  }

  &--md &__inner {
    width: 1.5rem;
    height: 1.5rem;
  }

  &--lg &__inner {
    width: 2rem;
    height: 2rem;
  }

  &--primary {
    color: var(--color-primary);
  }

  &--white {
    color: white;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>