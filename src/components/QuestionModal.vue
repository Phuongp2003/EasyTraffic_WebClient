<template>
  <UModal :dismissible="false" :close="false" v-model:show="show">
    <template #header>
      <div class="py-3">
        <div class="text-lg font-semibold">
          {{ isEditMode ? 'Sửa nội dung câu hỏi' : 'Tạo câu hỏi mới' }}
        </div>
        <p>
          {{ isEditMode ? 'Sửa nội dung sẵn có của câu hỏi' : 'Tạo câu hỏi mới cho bài khảo sát' }}
        </p>
      </div>
    </template>
    <template #body>
      <UForm :state="state" @submit="onSubmit">
        <UFormField label="Câu hỏi" required>
          <UInput v-model="state.question" />
        </UFormField>
        <UFormField label="Loại câu hỏi" required>
          <USelect
            v-model="state.type"
            :items="questionTypes"
            class="w-full"
            placeholder="Chọn loại câu hỏi"
          />
        </UFormField>
        <UFormField
          v-if="state.type !== 'text'"
          label="Lựa chọn (ngăn cách bởi dấu phẩy ',')"
          required
        >
          <UInput v-model="optionsInput" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Huỷ bỏ" @click="onCancel" />
        <UButton color="neutral" :label="isEditMode ? 'Cập nhật' : 'Thêm'" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { SurveyQuestion } from '@/composables/useSurveyQuestions'

const props = defineProps<{
  question: SurveyQuestion | null
  onSave: (question: SurveyQuestion) => void
  onCancel: () => void
}>()

const show = ref(true)
const isEditMode = ref(false)

type QuestionFormState = {
  question: string
  type: string
  options?: string
}

const state = reactive<QuestionFormState>({
  question: '',
  type: '',
  options: '',
})

const questionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Single Choice', value: 'single-choice' },
  { label: 'Multiple Choice', value: 'multiple-choice' },
]

const optionsInput = ref('')

watch(
  () => props.question,
  (newQuestion) => {
    if (newQuestion) {
      isEditMode.value = true
      Object.assign(state, newQuestion, {
        options: newQuestion.options ? JSON.parse(newQuestion.options).join(', ') : '',
      })
      optionsInput.value = newQuestion.options ? JSON.parse(newQuestion.options).join(', ') : ''
    } else {
      isEditMode.value = false
      Object.assign(state, { question: '', type: '', options: '' })
      optionsInput.value = ''
    }
  },
  { immediate: true },
)

const onSubmit = () => {
  const questionData = {
    ...state,
    options:
      state.type !== 'text'
        ? JSON.stringify(optionsInput.value.split(',').map((opt) => opt.trim()))
        : undefined,
  }
  props.onSave(questionData as SurveyQuestion)
}
</script>
