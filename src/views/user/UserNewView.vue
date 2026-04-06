<template>
  <div class="user-new-view">
    <h1 class="user-new-view__title">Добавить нового пользователя</h1>

    <form @submit.prevent="handleSubmit" class="user-form">
      <FormField
        label="ФИО"
        :error="errors.name || undefined"
        required
        input-id="name"
      >
        <Input
          id="name"
          v-model="form.name"
          type="text"
          :disabled="loading"
          :error="!!errors.name"
          @blur="validateField('name', form.name)"
        />
      </FormField>

      <FormField
        label="Email"
        :error="errors.email || undefined"
        required
        input-id="email"
      >
        <Input
          id="email"
          v-model="form.email"
          type="email"
          :disabled="loading"
          :error="!!errors.email"
          @blur="validateField('email', form.email)"
        />
      </FormField>

      <FormField
        label="Статус"
        input-id="status"
      >
        <Select
          id="status"
          v-model="form.status"
          :disabled="loading"
          :options="statusOptions"
        />
      </FormField>

      <div v-if="error" class="user-form__error">{{ error }}</div>

      <div class="user-form__actions">
        <Button type="submit" :loading="loading" :disabled="loading">
          {{ loading ? 'Добавляется...' : 'Добавить' }}
        </Button>
        <Button variant="secondary" @click="$router.push('/users')">
          Отменить
        </Button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { useValidate } from '@/composables/useValidate'
import { email, required } from '@/shared/validators'
import { Button, Input, Select, FormField } from '@/components'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  name: '',
  email: '',
  status: 'active' as 'active' | 'blocked'
})

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'blocked', label: 'Заблокирован' }
]

const schema = {
  email: [required, email],
  name: [required]
}

const { errors, validateField, validateAll } = useValidate(schema)

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (): Promise<void> => {
  error.value = null

  const isValid = validateAll(form)
  if (!isValid) return

  loading.value = true

  try {
    await userStore.addUser(form)
    await router.push('/users')
  } catch (err: unknown) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.user-new-view {
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;

  &__title {
    margin-bottom: 1rem;
  }
}

.user-form {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);

  &__error {
    color: var(--color-error);
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: var(--color-error-light);
    border-radius: var(--border-radius-sm);
  }

  &__actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
}
</style>