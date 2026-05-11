import { createRouter, createWebHistory } from 'vue-router'
import { categories } from '@/algorithms'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
  },
  ...categories.flatMap(cat =>
    cat.algorithms.map(algo => ({
      path: `/${cat.id}/${algo.meta.id}`,
      name: algo.meta.id,
      component: () => import('@/views/AlgorithmPage.vue'),
      props: { algorithmId: algo.meta.id },
    }))
  ),
  ...categories.map(cat => ({
    path: `/${cat.id}`,
    name: `cat-${cat.id}`,
    component: () => import('@/views/CategoryPage.vue'),
    props: { categoryId: cat.id },
  })),
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export function useNavItems() {
  return categories.map(cat => ({
    label: cat.label,
    icon: cat.icon,
    path: `/${cat.id}`,
    children: cat.algorithms.map(algo => ({
      label: algo.meta.name,
      path: `/${cat.id}/${algo.meta.id}`,
    })),
  }))
}
