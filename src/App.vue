<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">
        <RouterLink class="app__link" to="/">
          Управление пользователями
        </RouterLink>
      </h1>
    </header>

    <main class="app__content">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  min-height: 100vh;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
  }

  &__content {
    padding: 1.25rem;
  }
}
</style>
