<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="space-y-6">
    <UFormField label="Title" required>
      <UInput v-model="modelValue.title" class="w-full" />
    </UFormField>
    <UFormField label="Description" required>
      <UTextarea
        v-model="modelValue.description"
        class="w-full"
        placeholder="Type description..."
      />
    </UFormField>
    <UFormField label="Content" required>
      <EditorTool v-model="modelValue.content" :def-data="modelValue.content" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import type { ArticlePayload } from '@/composables/useArticles'
import EditorTool from '@/components/Editor/EditorTool.vue'

const props = defineProps<{
  modelValue: Partial<ArticlePayload>
}>()

const descriptionEditor = ref('')
const contentEditor = ref('')

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<ArticlePayload>): void
}>()

watch(
  () => descriptionEditor.value,
  () => {
    emit('update:modelValue', { ...props.modelValue })
  },
)

watch(
  () => contentEditor.value,
  () => {
    emit('update:modelValue', { ...props.modelValue })
  },
)
</script>
