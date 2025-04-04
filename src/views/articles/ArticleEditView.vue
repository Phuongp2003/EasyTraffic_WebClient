<template>
  <div class="p-4">
    <UTabs color="neutral" :items="tabs" variant="pill">
      <template #editor>
        <KeepAlive>
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">
                  {{ isEdit ? 'Sửa bài viết' : 'Tạo bài viết' }}
                  <span class="text-gray-500">({{ articleTypeLabel }})</span>
                </h1>
              </div>
            </template>
            <UStepper
              color="primary"
              ref="stepper"
              v-model="state.currentStep"
              :items="steps"
              class="mb-4"
            >
              <template v-for="step in steps" :key="step.slot" #[step.slot]>
                <KeepAlive
                  :include="['BasicInfoStep', 'ContentStep', 'FinalStep']"
                >
                  <component
                    color="neutral"
                    :is="getStepComponent(step.slot)"
                    v-model="state.formData"
                    :articleData="state.formData"
                  />
                </KeepAlive>
              </template>
            </UStepper>

            <div class="flex gap-2 justify-between mt-8">
              <UButton
                leading-icon="i-lucide-arrow-left"
                :disabled="!stepper?.hasPrev"
                @click="stepper?.prev()"
                variant="outline"
              >
                Previous
              </UButton>

              <UButton
                v-if="stepper?.hasNext"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
                @click="stepper?.next()"
              >
                Next
              </UButton>
              <UButton v-else trailing-icon="i-lucide-check" color="neutral" @click="handleSubmit">
                {{ isEdit ? 'Cập nhật' : 'Đăng bài' }}
              </UButton>
            </div>
          </UCard>
        </KeepAlive>
      </template>
      <template #preview>
        <UCard class="bg-white">
          <article class="prose prose-lg max-w-none">
            <h1 class="text-2xl font-bold mb-4">{{ state.formData.title }}</h1>
            <div class="text-gray-600 mb-8">{{ state.formData.description }}</div>
            <EditorShow :data="state.formData.content" />
          </article>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArticles, type ArticlePayload } from '@/composables/useArticles'
import BasicInfoStep from './steps/BasicInfoStep.vue'
import { useFileUpload } from '@/composables/useFileUpload'
import ContentStep from './steps/ContentStep.vue'
import FinalStep from './steps/FinalStep.vue'

const router = useRouter()
const route = useRoute()
const { createArticle, updateArticle, generateSlug, getArticleBySlug } = useArticles()
const { uploadFile } = useFileUpload()
const isEdit = computed(() => route.params.slug !== undefined)

const toast = useToast();

// Determine article type based on route
const articleType = computed(() => {
  const category = route.params.category as string
  if (category === 'news') return 'News'
  if (category === 'events') return 'Events'
  return ''
})

// Human-readable label for the article type
const articleTypeLabel = computed(() => {
  if (articleType.value === 'News') return 'Tin tức'
  if (articleType.value === 'Events') return 'Sự kiện'
  return ''
})

let initD
if (isEdit.value) {
  initD = await getArticleBySlug(route.params.slug as string)
}

const state = reactive({
  currentStep: 0,
  formData: {
    title: initD?.title || '',
    description: initD?.description || '',
    content: initD?.content || '',
    // Always use the type determined by the route
    type: articleType.value,
    status: initD?.status || 'DESIGNING',
    coverImage: initD?.coverImage || '',
    backgroundImage: initD?.backgroundImage || '',
  } as Partial<ArticlePayload>,
})

const tabs = [
  {
    label: 'Trình chỉnh sửa',
    icon: 'i-heroicons-pencil-square',
    slot: 'editor',
    description: 'Edit your article content and settings',
  },
  {
    label: 'Xem trước (thử nghiệm)',
    icon: 'i-heroicons-eye',
    slot: 'preview',
    description: 'Preview how your article will look',
  },
]

const stepper = ref()

const steps = [
  {
    slot: 'basic-info',
    title: 'Thông tin cơ bản',
    description: 'Thiết lập hình ảnh thumbnail và ảnh nền',
    icon: 'i-lucide-file-plus',
  },
  {
    slot: 'content',
    title: 'Nội dung',
    description: 'Thiết lập nội dung bài viết',
    icon: 'i-lucide-pencil',
  },
  {
    slot: 'final',
    title: 'Kiểm tra lại và trạng thái',
    description: 'Thiết lập trạng thái bài viết, đồng thời kiểm tra lại nội dung',
    icon: 'i-lucide-check-circle',
  },
]

// Map step slots to components
const stepComponents = {
  'basic-info': BasicInfoStep,
  content: ContentStep,
  final: FinalStep,
}

function getStepComponent(slot: string) {
  return stepComponents[slot as keyof typeof stepComponents]
}

const handleSubmit = async () => {
  // Process image uploads
  if (state.formData.coverImage && state.formData.coverImage instanceof File) {
    state.formData.coverImage = (await uploadFile(state.formData.coverImage)).secure_url
  }

  if (state.formData.backgroundImage && state.formData.backgroundImage instanceof File) {
    state.formData.backgroundImage = (await uploadFile(state.formData.backgroundImage)).secure_url
  }

  try {
    if (!state.formData.title) {
      throw new Error('Tiêu đề là bắt buộc để tạo đường dẫn')
    }

    // Always ensure type field is set correctly from the route
    state.formData.type = articleType.value

    // Generate slug based on title
    state.formData.slug = generateSlug(state.formData.title)

    // Create or update article
    if (isEdit.value) {
      await updateArticle(
        route.params.slug as string,
        state.formData as ArticlePayload,
      )
    } else {
      await createArticle(state.formData as ArticlePayload)
    }

    toast.add({
      title: 'Thành công',
      description: isEdit.value ? 'Bài viết đã được cập nhật' : 'Bài viết đã được tạo thành công',
      color: 'success'
    })

    router.push(`/articles/${route.params.category}`)
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'Lỗi',
      description: String(error) || 'Không thể lưu bài viết',
      color: 'error'
    })
  }
}
</script>
