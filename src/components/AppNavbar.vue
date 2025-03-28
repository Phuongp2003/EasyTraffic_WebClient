<template>
  <header
    class="sticky top-0 z-10 h-16 bg-gray-300 dark:bg-gray-800 border-r border-gray-400 dark:border-gray-400"
  >
    <div class="h-full px-4 flex items-center justify-between">
      <div class="flex-1">
        <UButton
          icon="i-lucide-menu"
          variant="ghost"
          class="dark:text-white"
          @click="layoutStore.toggleSidebar"
        />
      </div>
      <div class="flex items-center gap-4">
        <UButton
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          class="dark:text-white"
          @click="toggleDark"
        />
        <UDropdownMenu
          :items="userMenuItems"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 12,
          }"
          :ui="{
            content:
              'w-64 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2',
            item: 'my-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
          }"
          :closeOnScroll="true"
          :preventScroll="false"
        >
          <UserAvatar />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLayoutStore } from '../stores/layout'
import { useColorScheme } from '../composables/useColorScheme'
import UserAvatar from './UserAvatar.vue'
import { useAuth } from '../composables/useAuth'

const layoutStore = useLayoutStore()
const { isDark, toggleDark } = useColorScheme()

const userMenuItems = ref([
  {
    label: 'Tài khoản',
    icon: 'i-lucide-user',
    to: '/account',
  },
  {
    label: 'Quản lý người dùng',
    icon: 'i-lucide-users',
    to: '/users',
  },
  {
    label: 'Cài đặt',
    icon: 'i-lucide-settings',
    to: 'settings',
  },
  {
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    to: '/logout',
    click: async () => {
      const { logout } = useAuth()
      await logout()
    },
  },
])
</script>
