<template>
  <div class="form-field">
    <label
      v-if="label"
      :for="inputId"
      class="form-field__label"
    >
      {{ label }}
      <span v-if="required" class="form-field__required">*</span>
    </label>

    <slot />

    <span
      v-if="error"
      class="form-field__error-message"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  error?: string
  required?: boolean
  inputId?: string
}

withDefaults(defineProps<Props>(), {
  required: false
})
</script>

<style scoped lang="scss">
.form-field {
  margin-bottom: 1rem;

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--color-text-dark);
  }

  &__required {
    color: var(--color-error);
  }

  &__error-message {
    display: block;
    color: var(--color-error);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}
</style>