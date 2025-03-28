<template>
  <div>
    <div class="tag-wrap flex-row mb-3">
      <div
        v-for="(tag, index) in selectedTags"
        :key="index"
        class="selected-tag w-max inline flex-row items-center"
      >
        <UBadge color="neutral" class="relative">
          <UButton
            icon="i-heroicons-x"
            @click="removeTag(index)"
            size="xss"
            class="bg-red-700 absolute top-[-25%] right-[-10%]"
          />
          {{ tag.name }}
        </UBadge>
        >
      </div>
    </div>
    <USelect
      v-model="currentTagId"
      :items="availableTags"
      label-key="name"
      value-key="id"
      placeholder="Chọn 1 thẻ"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Tag {
  id: string
  name: string
  parent: string | null
  createdAt: string
}

const props = defineProps<{
  modelValue: Tag['id'] | ''
  options: Tag[]
}>()

const emit = defineEmits(['update:model-value'])

const selectedTags = ref<Tag[]>([])
const currentTagId = ref<Tag['id'] | ''>('')

const availableTags = computed(() => {
  if (selectedTags.value.length === 0) {
    return props.options.filter((tag) => !tag.parent)
  }
  const lastSelectedTag = selectedTags.value[selectedTags.value.length - 1]
  return props.options.filter((tag) => tag.parent === lastSelectedTag.name)
})

watch(currentTagId, (newValue) => {
  if (newValue && newValue !== '') {
    const currentTag = props.options.find((tag) => tag.id === newValue)
    if (currentTag) {
      console.log(selectedTags.value)
      selectedTags.value.push(currentTag)
      emit('update:model-value', newValue)
    }
    currentTagId.value = ''
  }
})

const removeTag = (index: number) => {
  selectedTags.value = selectedTags.value.slice(0, index)
  emit('update:model-value', selectedTags.value[selectedTags.value.length - 1]?.id || '')
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const tags = []
      let currentTagId = newValue
      while (currentTagId) {
        const currentTag = props.options.find((tag) => tag.id === currentTagId)
        if (currentTag) {
          tags.unshift(currentTag)
          const nTag = props.options.find((tag) => tag.name === currentTag.parent)
          currentTagId = nTag?.id ?? ''
        } else {
          currentTagId = ''
        }
      }
      selectedTags.value = tags
    } else {
      selectedTags.value = []
    }
  },
  { immediate: true },
)
</script>
