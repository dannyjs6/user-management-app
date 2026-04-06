import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UsersView from '@/views/user/UsersListView.vue'
import UserNewView from '@/views/user/UserNewView.vue'
import UserEditView from '@/views/user/UserEditView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/users', name: 'Users', component: UsersView },
    { path: '/users/new', name: 'UserNew', component: UserNewView },
    { path: '/users/:id/edit', name: 'UserEdit', component: UserEditView }
  ]
})

export default router
