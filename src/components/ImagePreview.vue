<template>
  <div>
    <div class="relative group">
      <img
        :src="props.src"
        :alt="props.alt"
        class="w-32 h-32 object-cover rounded-lg cursor-pointer"
        @click="isOpen = true"
      />
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-opacity rounded-lg flex items-center justify-center"
      >
        <UButton
          v-show="false"
          class="group-hover:block"
          color="secondary"
          variant="ghost"
          icon="i-heroicons-arrows-pointing-out"
          @click="isOpen = true"
        />
      </div>
    </div>

    <UModal v-model="isOpen">
      <UButton label="Preview Image" color="secondary" variant="ghost" />

      <template #body>
        <div class="relative bg-gray-900 rounded-lg overflow-hidden">
          <img
            :src="props.src"
            :alt="props.alt"
            class="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
const props = defineProps<{
  src: string
  alt?: string
}>()

const isOpen = ref(false)
</script>
