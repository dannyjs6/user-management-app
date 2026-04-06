<template>
  <span :class="badgeClasses">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'active' | 'blocked' | 'info'
  size?: 'sm' | 'md'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  size: 'md'
})

const badgeClasses = computed(() => {
  return [
    'status-badge',
    `status-badge--${props.variant}`,
    `status-badge--${props.size}`
  ]
})
</script>

<style scoped lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;

  &--active {
    background: var(--color-success-light);
    color: var(--color-success-dark);
  }

  &--blocked {
    background: var(--color-error-light);
    color: var(--color-error-dark);
  }

  &--info {
    background: #dbeafe;
    color: #1e40af;
  }

  &--sm {
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
  }
}
</style>