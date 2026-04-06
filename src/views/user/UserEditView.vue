<template>
  <div class="user-edit-view">
    <h1 class="user-edit-view__title">Изменить пользователя</h1>

    <div v-if="loading" class="user-edit-view__loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="!user" class="user-edit-view__not-found">
      Пользователь не найден
    </div>
    <div v-else>
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
            :disabled="submitting"
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
            :disabled="submitting"
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
            :disabled="submitting"
            :options="statusOptions"
          />
        </FormField>

        <div v-if="error" class="user-form__error">{{ error }}</div>

        <div class="user-form__actions">
          <Button type="submit" :loading="submitting" :disabled="submitting">
            {{ submitting ? 'Редактируется...' : 'Редактировать' }}
          </Button>
          <Button variant="secondary" @click="$router.push('/users')">
            Отменить
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { useValidate } from '@/composables/useValidate'
import { email, required } from '@/shared/validators'
import { Button, Input, Select, FormField, LoadingSpinner } from '@/components'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const statusOptions = [
  { value: 'active', label: 'Активен' },
  { value: 'blocked', label: 'Заблокирован' }
]

const loading = ref(true)
const submitting = ref(false)
const error = ref<string | undefined>()

const userId = computed(() => (route.params.id as string))

const user = computed(() =>
  userStore.users.find(u => u.id === userId.value)
)

const form = reactive({
  name: '',
  email: '',
  status: 'active' as 'active' | 'blocked'
})

const schema = {
  email: [required, email],
  name: [required]
}

const { errors, validateField, validateAll } = useValidate(schema)

const loadUser = () => {
  if (user.value) {
    form.name = user.value.name
    form.email = user.value.email
    form.status = user.value.status
  }
  loading.value = false
}

const handleSubmit = async (): Promise<void> => {
  error.value = undefined

  if (!user.value) {
    error.value = 'User not found'
    return
  }

  if (!validateAll(form)) return

  submitting.value = true

  try {
    await userStore.updateUser(userId.value, {
      name: form.name,
      email: form.email,
      status: form.status,
      registrationDate: user.value.registrationDate
    })

    await router.push('/users')
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (userStore.users.length === 0) {
    userStore.fetchUsers().then(() => {
      loadUser()
    })
  } else {
    loadUser()
  }
})
</script>

<style scoped lang="scss">
.user-edit-view {
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;

  &__title {
    margin-bottom: 1rem;
  }

  &__loading {
    text-align: center;
    padding: 2rem;
  }

  &__not-found {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-secondary);
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