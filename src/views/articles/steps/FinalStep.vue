<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  articleData: {
    type: Object,
    required: true,
  },
  currentStep: Number,
  totalSteps: Number,
})

const emit = defineEmits(['update:articleData', 'prev-step'])

const statusOptions = [
  { id: 'READY', name: 'Công khai', icon: 'i-heroicons-check-circle', description: 'Bất kì ai cũng nhìn thấy' },
  { id: 'HIDING', name: 'Ản', icon: 'i-heroicons-eye-slash', description: 'Ẩn bài viết khỏi người xem' },
  { id: 'DESIGNING', name: 'Đang thiết kế/Nháp', icon: 'i-heroicons-pencil-square', description: 'Chỉ đội ngũ quản lý xem được' },
]

const articleStatus = ref(props.articleData.status || 'DESIGNING')

function updateStatus(status: string) {
  articleStatus.value = status

  // Update parent component
  const updatedArticleData = {
    ...props.articleData,
    status: articleStatus.value.toUpperCase(),
    description: statusOptions.find(option => option.id === status)?.description || '',
  }
  emit('update:articleData', updatedArticleData)
}
</script>

<template>
  <div class="final-step">
    <UCard class="mb-6" color="neutral">
      <template #header>
        <h2 class="text-xl font-bold">{{ t('Article Status') }}</h2>
      </template>

      <div class="status-selection grid grid-cols-3 gap-4 border-green-500">
        <div
          v-for="status in statusOptions"
          :key="status.id"
          class="status-option cursor-pointer border rounded-lg p-4 transition-all"
          :class="{
            'border-2': status.id === articleStatus,
            [`border-primary-500`]: status.id === articleStatus,
            [`border-gray-200 hover:border-yellow-300`]: status.id !== articleStatus,
          }"
          @click="updateStatus(status.id)"
        >
          <div class="flex items-center gap-2" :class="`text-white-600`">
            <UIcon :name="status.icon" class="text-xl" />
            <span class="font-medium">{{ t(status.name) }}</span>
          </div>
          <p class="mt-2 text-sm text-gray-400">
            {{ t(status.description) }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.preview-container {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
