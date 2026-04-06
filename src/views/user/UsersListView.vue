<template>
  <div class="users-view">
    <h1 class="users-view__title">Список пользователей</h1>

    <div class="users-view__controls">
      <div class="users-view__search-container">
        <Input
          v-model="searchInput"
          @input="handleSearch"
          type="text"
          placeholder="Искать по ФИО или email"
        />
      </div>
      <Button @click="$router.push('/users/new')">
        Добавить нового пользователя
      </Button>
    </div>

    <div v-if="userStore.loading" class="users-view__loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="userStore.error" class="users-view__error">{{ userStore.error }}</div>
    <div v-else-if="userStore.users.length === 0" class="users-view__no-users">
      Пользователи не найдены. <router-link to="/users/new">Добавьте первого пользователя</router-link>.
    </div>
    <div v-else class="users-view__table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Email</th>
            <th>Дата регистрации</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ new Date(user.registrationDate).toLocaleDateString() }}</td>
            <td>
              <StatusBadge :variant="user.status === 'active' ? 'active' : 'blocked'">
                {{ user.status === 'active' ? 'Активен' : 'Заблокирован' }}
              </StatusBadge>
            </td>
            <td>
              <Button variant="success" size="sm" @click="$router.push(`/users/${user.id}/edit`)">
                Редактировать
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <Button
          variant="secondary"
          @click="goToPage(pageFromQuery - 1)"
          :disabled="pageFromQuery === 1"
        >
          ← Назад
        </Button>

        <div v-if="totalPages > 1" class="pagination__numbers">
          <Button
            v-if="visiblePages[0] > 1"
            variant="secondary"
            @click="goToPage(1)"
          >
            1
          </Button>

          <span v-if="visiblePages[0] > 2" class="pagination__dots">...</span>

          <Button
            v-for="page in visiblePages"
            :key="page"
            variant="secondary"
            @click="goToPage(page)"
            :class="{ 'pagination__btn--active': page === pageFromQuery }"
          >
            {{ page }}
          </Button>

          <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="pagination__dots">...</span>

          <Button
            v-if="visiblePages[visiblePages.length - 1] < totalPages"
            variant="secondary"
            @click="goToPage(totalPages)"
          >
            {{ totalPages }}
          </Button>
        </div>

        <Button
          variant="secondary"
          @click="goToPage(pageFromQuery + 1)"
          :disabled="pageFromQuery >= totalPages"
        >
          Далее →
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.store'
import { Button, Input, StatusBadge, LoadingSpinner } from '@/components'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const searchInput = ref('')

const pageFromQuery = computed(() => {
  const page = route.query.page
  return page ? parseInt(page as string) : 1
})

const searchFromQuery = computed(() => {
  const search = route.query.search
  return search ? search as string : ''
})

const totalPages = computed(() => {
  return Math.ceil((userStore.total || userStore.users.length) / userStore.limit)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, pageFromQuery.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page: number) => {
  const query: any = { page }
  if (searchFromQuery.value) {
    query.search = searchFromQuery.value
  }
  router.push({ path: '/users', query })
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    const query: any = { page: 1 }
    if (searchInput.value.trim()) {
      query.search = searchInput.value.trim()
    }
    router.push({ path: '/users', query })
    userStore.setSearch(searchInput.value)
  }, 300)
}

watch(pageFromQuery, (newPage) => {
  userStore.setPage(newPage)
})

watch(searchFromQuery, (newSearch) => {
  searchInput.value = newSearch
  userStore.setSearch(newSearch)
})

onMounted(() => {
  searchInput.value = searchFromQuery.value

  const params: any = { page: pageFromQuery.value }
  if (searchFromQuery.value) {
    params.search = searchFromQuery.value
  }
  userStore.fetchUsers(params)
})
</script>

<style scoped lang="scss">
.users-view {
  padding: 2rem;

  &__title {
    margin-bottom: 1rem;
  }

  &__controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  &__search-container {
    flex: 1;
    min-width: 200px;
  }

  &__loading,
  &__error,
  &__no-users {
    text-align: center;
    padding: 2rem;
  }

  &__error {
    color: var(--color-error);
  }

  &__no-users {
    color: var(--color-text-secondary);
  }

  &__table-container {
    overflow-x: auto;
  }
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid var(--color-border-light);

  th,
  td {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border-light);
    text-align: left;
  }

  th {
    background: var(--color-background-light);
    color: var(--color-text-dark);
    font-weight: 600;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
  flex-wrap: wrap;

  &__numbers {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  &__dots {
    color: var(--color-text-secondary);
    padding: 0 0.25rem;
    font-weight: 500;
  }

  &__btn--active {
    background: var(--color-primary-darker);
    font-weight: 600;
  }
}
</style>