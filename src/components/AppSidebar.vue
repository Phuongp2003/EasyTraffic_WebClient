<template>
  <div
    class="fixed top-0 left-0 h-screen transition-all duration-300 overflow-hidden"
    :class="[layoutStore.sidebarOpen ? 'w-64' : 'w-0']"
  >
    <div
      class="h-full bg-gray-300 dark:bg-gray-800 border-r border-gray-400 dark:border-gray-400 transition-all duration-300"
      :class="[layoutStore.sidebarOpen ? 'w-64' : 'w-0']"
    >
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">EZF CMS</h1>
      </div>
      <UNavigationMenu orientation="vertical" :items="menuItems" class="w-full px-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '../stores/layout'

const layoutStore = useLayoutStore()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
    active: false,
  },
  {
    label: 'Quản lý bài viết',
    icon: 'i-lucide-newspaper',
    to: '/articles',
    children: [
      {
        label: 'Tin tức',
        description: 'Quản lý tin tức',
        icon: 'i-lucide-newspaper',
        to: '/articles/news',
      },
      {
        label: 'Sự kiện',
        description: 'Quản lý sự kiện',
        icon: 'i-lucide-calendar',
        to: '/articles/events',
      }
    ],
  },
  {
    label: 'Quản lý biên bản phạt',
    icon: 'i-lucide-file-text',
    to: '/reports',
  },
  {
    label: 'Quản lý giao dịch',
    icon: 'i-lucide-file-text',
    to: '/transactions',
  },
  {
    label: 'Quản lý người dùng',
    icon: 'i-lucide-users',
    to: '/users',
  }
]
</script>
