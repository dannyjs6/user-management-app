<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button__spinner"></span>
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'success' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  text?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  return [
    'button',
    `button--${props.variant}`,
    `button--${props.size}`,
    {
      'button--disabled': props.disabled || props.loading,
      'button--loading': props.loading
    }
  ]
})
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &--primary {
    background: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    &:active {
      background: var(--color-primary-darker);
    }
  }

  &--success {
    background: var(--color-success);
    color: white;

    &:hover:not(:disabled) {
      background: var(--color-success-dark);
    }
  }

  &--secondary {
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);

    &:hover:not(:disabled) {
      background: var(--color-background-light);
      border-color: var(--color-border-light);
    }
  }

  &--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  &--md {
    padding: 0.5rem 1rem;
  }

  &--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &--disabled {
    opacity: 0.6;
  }

  &--loading {
    pointer-events: none;
  }

  &__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>