<template>
  <input
    :class="inputClasses"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  error: false,
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClasses = computed(() => {
  return [
    'input',
    `input--${props.size}`,
    {
      'input--disabled': props.disabled,
      'input--error': props.error
    }
  ]
})
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-family: inherit;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: var(--color-background-light);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--error {
    border-color: var(--color-error);

    &:focus {
      border-color: var(--color-error);
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  }

  &--sm {
    padding: 0.375rem;
    font-size: 0.875rem;
  }

  &--lg {
    padding: 0.75rem;
    font-size: 1.125rem;
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}
</style>