<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  isEditing: boolean
  tag?: {
    id: string
    name: string
    parentId: string | null
  }
  parentOptions: Array<{ id: string; name: string }>
  onSubmit: (formData: { name: string; parentId: string | null }) => void
  onCancel: () => void
}>()

const defaultForm = {
  name: '',
  parentId: null,
}

const form = ref({
  name: props.tag?.name || '',
  parentId: props.tag?.parentId || null,
})

// Transform parent options to match SelectMenu format and add "No parent" option
const selectItems = computed(() => [
  {
    label: 'Không có thẻ cha',
    value: null,
    icon: 'i-heroicons-minus',
  },
  ...props.parentOptions.map((opt) => ({
    label: opt.name,
    value: opt.id,
    icon: 'i-heroicons-tag',
  })),
])

const selected = computed({
  get: () => selectItems.value.find((item) => item.value === form.value.parentId),
  set: (item) => {
    form.value.parentId = item?.value || null
  },
})

function onClose() {
  form.value = { ...defaultForm }
  props.onCancel()
}

// Transform the empty string back to null when submitting
function onThisSubmit() {
  props.onSubmit({
    name: form.value.name,
    parentId: form.value.parentId === '' ? null : form.value.parentId,
  })
}
</script>

<template>
  <UModal :dismissible="false" :close="false">
    <template #header>
      <div class="py-3">
        <div class="text-lg font-semibold">{{ isEditing ? 'Sửa thẻ' : 'Tạo thẻ mới' }}</div>
        <p>
          {{
            isEditing ? 'Sửa thông tin thẻ có sẵn' : 'Tạo một thẻ mới cho các bài viết tương lai'
          }}
        </p>
      </div>
    </template>
    <template #body>
      <UForm :state="form" @submit="onThisSubmit">
        <UFormField label="Tên thẻ" required>
          <UInput v-model="form.name" />
        </UFormField>
        <UFormField label="Thẻ cha">
          <USelectMenu v-model="selected" :items="selectItems" class="w-[150px]">
            <template #item="{ item }">
              <UIcon :name="item.icon" class="mr-2 flex-shrink-0" />
              {{ item.label }}
            </template>
          </USelectMenu>
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Huỷ bỏ" @click="onClose()" />
        <UButton
          color="neutral"
          :label="isEditing ? 'Cập nhật' : 'Tạo mới'"
          @click="onThisSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
