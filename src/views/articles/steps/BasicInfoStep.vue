<template>
  <div class="space-y-6">
    <UFormField label="Type" required>
      <USelect
        v-model="modelValue.type"
        :items="typeOptions"
        placeholder="Select article type"
        @update:model-value="updateType"
      />
    </UFormField>

    <UFormField label="Cover Image">
      <UFileUpload v-model="coverImage" accept="image/*" :max-size="5" @error="handleUploadError" />
      <UButton
        v-if="!coverImage"
        color="neutral"
        @click="showCoverImageInput = !showCoverImageInput"
        >Enter image URL</UButton
      >
      <UInput v-if="showCoverImageInput" v-model="coverImage" placeholder="Enter image URL" />
      <template #help>
        <span class="text-xs text-gray-500">Recommended size: 1200x630px, max 5MB</span>
      </template>
    </UFormField>

    <UFormField label="Thumbnail">
      <UFileUpload
        v-model="backgroundImage"
        accept="image/*"
        :max-size="2"
        @error="handleUploadError"
      />
      <UButton
        v-if="!backgroundImage"
        color="neutral"
        @click="showThumbnailImageInput = !showThumbnailImageInput"
        >Enter image URL</UButton
      >
      <UInput
        v-if="showThumbnailImageInput"
        v-model="backgroundImage"
        placeholder="Enter image URL"
      />
      <template #help>
        <span class="text-xs text-gray-500">Recommended size: 300x300px, max 2MB</span>
      </template>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BasicInfoStep',
})

import {  ref, watch } from 'vue'
import type { ArticlePayload } from '@/composables/useArticles'
import { useFileUpload } from '@/composables/useFileUpload'
import UFileUpload from '@/components/UFileUpload.vue'

const props = defineProps<{
  modelValue: Partial<ArticlePayload>
}>()

const coverImage = ref(props.modelValue.coverImage)
const showCoverImageInput = ref(false)
const backgroundImage = ref(props.modelValue.backgroundImage || '')
const showThumbnailImageInput = ref(false)

const typeOptions = [
  { label: 'Tin tức', value: 'News' },
  { label: 'Sự kiện', value: 'Events' }
]

watch(coverImage, (newValue) => {
  emit('update:modelValue', { ...props.modelValue, coverImage: newValue })
})

watch(backgroundImage, (newValue) => {
  emit('update:modelValue', { ...props.modelValue, backgroundImage: newValue })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<ArticlePayload>): void
}>()

const { uploadFile } = useFileUpload()

const toast = useToast()

function handleUploadError(message: string) {
  toast.add({
    title: 'Upload Error',
    description: message,
    color: 'error',
  })
}

function updateType(value: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    type: value,
  })
}

async function uploadImages() {
  const uploads = []

  if (props.modelValue.coverImage && props.modelValue.coverImage instanceof File) {
    uploads.push(
      uploadFile(props.modelValue.coverImage).then((response) => {
        emit('update:modelValue', {
          ...props.modelValue,
          coverImage: response.secure_url,
        })
      }),
    )
  }

  if (props.modelValue.backgroundImage && props.modelValue.backgroundImage instanceof File) {
    uploads.push(
      uploadFile(props.modelValue.backgroundImage).then((response) => {
        emit('update:modelValue', {
          ...props.modelValue,
          backgroundImage: response.secure_url,
        })
      }),
    )
  }

  try {
    await Promise.all(uploads)
    return true
  } catch (error) {
    toast.add({
      title: 'Upload Error',
      description: 'Failed to upload one or more images',
      color: 'error',
    })
    console.error(error)
    return false
  }
}

// Expose uploadImages method to parent
defineExpose({
  uploadImages,
})


</script>
