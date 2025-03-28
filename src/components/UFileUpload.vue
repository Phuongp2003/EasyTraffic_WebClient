<template>
  <div class="w-full">
    <div
      class="border-2 border-dashed rounded-lg p-4 text-center"
      :class="{
        'border-gray-300 hover:border-gray-400': !isDragging,
        'border-primary': isDragging,
        'opacity-50': disabled,
      }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        :multiple="multiple"
        @change="onFileChange"
      />

      <div v-if="modelValue" class="space-y-4">
        <div class="flex items-start gap-4">
          <ImagePreview
            v-if="isImage"
            :src="previewUrl || (modelValue as string)"
            :alt="fileName"
          />
          <div class="flex-1">
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ fileName }}</span>
              <span class="text-xs text-gray-500">{{ fileSize }}</span>
            </div>
            <div class="mt-2 flex gap-2">
              <UButton
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                size="xs"
                @click="clearFile"
              >
                Remove
              </UButton>
              <UButton
                v-if="isImage"
                color="secondary"
                variant="soft"
                icon="i-heroicons-photo"
                size="xs"
                @click="replaceFile"
              >
                Replace
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-2">
        <UIcon name="i-heroicons-cloud-arrow-up" class="h-8 w-8 mx-auto text-gray-400" />
        <div class="text-sm">
          <span
            class="text-primary font-medium hover:underline cursor-pointer"
            @click="triggerFileInput"
          >
            Nhấn vào đây để tài lên
          </span>
          <span class="text-gray-500"> hoặc kéo thả vào ô này</span>
        </div>
        <p class="text-xs text-gray-500">
          {{ accept ? `Allowed types: ${accept}` : 'Any file type' }}
        </p>
      </div>

      <UProgress
        v-if="uploading"
        class="mt-2"
        :value="uploadProgress"
        :color="uploadProgress === 100 ? 'success' : 'primary'"
      />
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ImagePreview from './ImagePreview.vue'

const props = defineProps<{
  modelValue?: File | string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | string | null): void
  (e: 'error', message: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const error = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const previewUrl = ref<string>('')

// Update previewUrl when modelValue changes
onMounted(() => {
  if (typeof props.modelValue === 'string' && props.modelValue) {
    previewUrl.value = props.modelValue
  } else if (props.modelValue instanceof File && isImage.value) {
    previewUrl.value = URL.createObjectURL(props.modelValue)
  }
})

const isImage = computed(() => {
  if (props.modelValue instanceof File) {
    return props.modelValue.type.startsWith('image/')
  }
  return (
    typeof props.modelValue === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(props.modelValue)
  )
})

const fileName = computed(() => {
  if (props.modelValue instanceof File) {
    return props.modelValue.name
  }
  return props.modelValue?.split('/').pop() || ''
})

const fileSize = computed(() => {
  if (props.modelValue instanceof File) {
    return formatFileSize(props.modelValue.size)
  }
  return ''
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function triggerFileInput() {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

function validateFile(file: File): boolean {
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    error.value = `Kích thước tệp phải nhỏ hơn ${props.maxSize}MB`
    return false
  }

  if (props.accept) {
    const allowedTypes = props.accept.split(',').map((type) => type.trim())
    const fileType = file.type || `.${file.name.split('.').pop()}`
    if (!allowedTypes.some((type) => fileType.match(type))) {
      error.value = `Loại của tệp phải là: ${props.accept}`
      return false
    }
  }

  error.value = ''
  return true
}

async function handleFile(file: File) {
  if (!validateFile(file)) return

  // Clear existing preview URL if any
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  // Create preview URL for images
  if (file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file)
  }

  // Simulate upload progress
  uploading.value = true
  for (let i = 0; i <= 100; i += 10) {
    uploadProgress.value = i
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  uploading.value = false

  emit('update:modelValue', file)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    handleFile(input.files[0])
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files.length) {
    handleFile(event.dataTransfer.files[0])
  }
}

function clearFile() {
  if (previewUrl.value && props.modelValue instanceof File) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
}

function replaceFile() {
  triggerFileInput()
}

// Clean up preview URL when component is unmounted
onBeforeUnmount(() => {
  if (previewUrl.value && props.modelValue instanceof File) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>
