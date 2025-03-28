<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EditorTool from '@/components/Editor/EditorTool.vue'

const { t } = useI18n()
const toast = useToast()

const props = defineProps({
  articleData: {
    type: Object,
    required: true,
  },
  currentStep: Number,
  totalSteps: Number,
})

const emit = defineEmits(['update:articleData', 'prev-step', 'next-step'])

const availableLanguages = ref([
  { id: 'en', name: 'English' },
  { id: 'vi', name: 'Vietnamese' },
  { id: 'zh', name: 'Chinese' },
])

const translations = ref(props.articleData.translations || [])
const selectedLanguage = ref<{ id: string; name: string } | null>(null)
const isAddingTranslation = ref(false)

const currentTranslation = reactive({
  id: null as string | null,
  language: '',
  title: '',
  subtitle: '',
  content: '',
})

function startAddingTranslation() {
  if (!selectedLanguage.value) {
    toast.add({
      title: 'Error',
      description: 'Please select a language first',
      color: 'error',
    })
    return
  }

  const existingTranslation = translations.value.find(
    (translation: { language: string }) => translation.language === selectedLanguage.value?.id,
  )

  if (existingTranslation) {
    toast.add({
      title: 'Error',
      description: `Translation for ${selectedLanguage.value?.name} already exists`,
      color: 'error',
    })
    return
  }

  currentTranslation.language = selectedLanguage.value.id
  isAddingTranslation.value = true
}

function saveTranslation() {
  if (!currentTranslation.title || !currentTranslation.content) {
    toast.add({
      title: 'Error',
      description: 'Title and content are required',
      color: 'error',
    })
    return
  }

  const newTranslation = {
    id: currentTranslation.id || Date.now().toString(),
    language: currentTranslation.language,
    title: currentTranslation.title,
    subtitle: currentTranslation.subtitle,
    content: currentTranslation.content,
  }

  const index = translations.value.findIndex(
    (translation: { id: string }) => translation.id === newTranslation.id,
  )

  if (index !== -1) {
    translations.value[index] = newTranslation
  } else {
    translations.value.push(newTranslation)
  }

  // Update parent component
  const updatedArticleData = {
    ...props.articleData,
    translations: translations.value,
  }
  emit('update:articleData', updatedArticleData)

  resetForm()
  isAddingTranslation.value = false
  toast.add({
    title: 'Success',
    description: 'Translation saved successfully',
    color: 'success',
  })
}

function editTranslation(translation: {
  id: string
  language: string
  title: string
  subtitle: string
  content: string
}) {
  currentTranslation.id = translation.id
  currentTranslation.language = translation.language
  currentTranslation.title = translation.title
  currentTranslation.subtitle = translation.subtitle
  currentTranslation.content = translation.content

  isAddingTranslation.value = true
}

function deleteTranslation(id: string) {
  translations.value = translations.value.filter(
    (translation: { id: string }) => translation.id !== id,
  )

  // Update parent component
  const updatedArticleData = {
    ...props.articleData,
    translations: translations.value,
  }
  emit('update:articleData', updatedArticleData)

  toast.add({
    title: 'Success',
    description: 'Translation deleted successfully',
    color: 'success',
  })
}

function resetForm() {
  currentTranslation.id = null
  currentTranslation.language = ''
  currentTranslation.title = ''
  currentTranslation.subtitle = ''
  currentTranslation.content = ''
  selectedLanguage.value = null
}

function cancelTranslation() {
  resetForm()
  isAddingTranslation.value = false
}

function getLanguageName(code: string) {
  const lang = availableLanguages.value.find((l) => l.id === code)
  return lang ? lang.name : code
}

watch(
  () => currentTranslation.content,
  () => {
    emit('update:articleData', { ...props.articleData, content: currentTranslation.content })
  },
)
</script>

<template>
  <div class="translation-step">
    <UCard class="mb-4" color="neutral">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">{{ t('Translations') }}</h2>
          <UButton v-if="!isAddingTranslation" color="neutral" @click="isAddingTranslation = true">
            {{ t('Add Translation') }}
          </UButton>
        </div>
      </template>

      <div v-if="isAddingTranslation" class="translation-form mb-4">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">
                {{ currentTranslation.id ? t('Edit Translation') : t('Add New Translation') }}
              </h3>
              <UButton
                color="neutral"
                variant="outline"
                icon="i-heroicons-x-mark"
                @click="cancelTranslation"
              />
            </div>
          </template>

          <div v-if="!currentTranslation.id" class="mb-4">
            <UFormField label="Language" required>
              <USelectMenu
                v-model="selectedLanguage"
                :items="availableLanguages"
                option-key="name"
                value-key="id"
                label-key="name"
                placeholder="Select language"
              >
              </USelectMenu
            ></UFormField>
          </div>

          <UFormField label="Title" required>
            <UInput v-model="currentTranslation.title" />
          </UFormField>
          <UFormField label="Description" required>
            <UTextarea
              v-model="currentTranslation.subtitle"
              class="w-full"
              placeholder="Type description..."
            />
          </UFormField>
          <UFormField label="Content" required>
            <EditorTool v-model="currentTranslation.content" />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="cancelTranslation">
              {{ t('Cancel') }}
            </UButton>
            <UButton color="neutral" @click="saveTranslation">
              {{ t('Save') }}
            </UButton>
          </div>
        </UCard>
      </div>

      <div v-else-if="translations && translations.length > 0" class="translations-list">
        <div v-for="translation in translations" :key="translation.id" class="mb-4">
          <UCard>
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">{{ getLanguageName(translation.language) }}</h3>
              <div class="flex gap-2">
                <UButton variant="outline" size="sm" @click="editTranslation(translation)">
                  {{ t('Edit') }}
                </UButton>
                <UButton color="neutral" size="sm" @click="deleteTranslation(translation.id)">
                  {{ t('Delete') }}
                </UButton>
              </div>
            </div>
            <p class="font-bold mb-1">{{ translation.title }}</p>
            <p v-if="translation.subtitle" class="text-gray-600 mb-2">{{ translation.subtitle }}</p>
            <div class="border-t pt-2 mt-2">
              <p class="text-sm text-gray-500">{{ t('Content preview') }}:</p>
              <div class="max-h-24 overflow-hidden text-sm text-gray-700">
                {{ translation.content.replace(/<[^>]*>/g, '').slice(0, 150) }}...
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <div v-else-if="!isAddingTranslation" class="empty-state">
        <div class="text-center py-8">
          <p class="text-gray-500 mb-4">{{ t('No translations added yet') }}</p>
          <UButton color="primary" @click="startAddingTranslation">
            {{ t('Add Translation') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
