<template>
  <div class="home-view">
    <h1 class="home-view__title">Модуль управления пользователями</h1>
    <p class="home-view__subtitle">Добро пожаловать в панель управления пользователями.</p>

    <nav class="home-view__nav">
      <Button variant="primary" size="lg" @click="$router.push('/users')">
        Просмотреть всех пользователей
      </Button>
      <Button variant="success" size="lg" @click="$router.push('/users/new')">
        Добавить нового пользователя
      </Button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components'

const router = useRouter()
</script>

<style scoped lang="scss">
.home-view {
  padding: 2rem;

  &__title {
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
  }

  &__nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
}
</style>
