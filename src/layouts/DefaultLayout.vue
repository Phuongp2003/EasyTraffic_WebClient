<template>
  <div class="h-screen flex overflow-hidden">
    <AppSidebar />
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="[layoutStore.sidebarOpen ? 'ml-64' : 'ml-0']"
    >
      <AppNavbar />
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '../stores/layout'
import AppSidebar from '../components/AppSidebar.vue'
import AppNavbar from '../components/AppNavbar.vue'

const layoutStore = useLayoutStore()
</script>
