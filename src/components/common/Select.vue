<template>
  <select
    :class="selectClasses"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  error: false,
  size: 'md',
  options: () => []
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectClasses = computed(() => {
  return [
    'select',
    `select--${props.size}`,
    {
      'select--disabled': props.disabled,
      'select--error': props.error
    }
  ]
})
</script>

<style scoped lang="scss">
.select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-family: inherit;
  font-size: 1rem;
  background: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;
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
    padding: 0.375rem 2rem 0.375rem 0.375rem;
    font-size: 0.875rem;
  }

  &--lg {
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    font-size: 1.125rem;
  }

  option {
    padding: 0.5rem;
  }
}
</style>