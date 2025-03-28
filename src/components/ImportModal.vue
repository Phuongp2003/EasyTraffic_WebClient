<template>
  <UModal :dismissible="false" :close="false" v-model:show="show">
    <template #header>
      <div class="py-3">
        <div class="text-lg font-semibold">Nhập nhanh câu hỏi</div>
        <p>Gửi danh sách câu hỏi qua tập csv</p>
      </div>
    </template>
    <template #body>
      <UForm @submit="onSubmit" :state="state">
        <UFormField label="CSV File" required>
          <UFileUpload v-model="file" accept=".csv" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Huỷ bỏ" @click="onCancel" />
        <UButton color="neutral" label="Nhập câu hỏi" @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UFileUpload from '@/components/UFileUpload.vue'

const props = defineProps<{
  onImport: (file: FormData) => void
  onCancel: () => void
  state: object
}>()

interface FormData {
  file: File | null
}

const formData = reactive<FormData>({
  file: null as File | null,
})

const show = ref(true)
const file = ref<File | null>(null)

const onSubmit = () => {
  if (file.value) {
    formData.file = file.value
    props.onImport(formData)
  } else {
    alert('Please select a file to import.')
  }
}
</script>
