<template>
  <UApp>
    <component :is="layout">
      <Suspense>
        <RouterView />
      </Suspense>
    </component>
  </UApp>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout || DefaultLayout)
</script>
