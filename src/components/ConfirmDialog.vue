<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'error' | 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Xác nhận',
  cancelLabel: 'Huỷ bỏ',
  confirmColor: 'error',
})

const handleConfirm = () => {
  props.onConfirm()
}

const handleCancel = () => {
  props.onCancel()
}
</script>

<template>
  <UModal>
    <template #header>
      <div class="py-3">
        <div class="text-lg font-semibold">{{ title }}</div>
        <p>{{ message }}</p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" :label="cancelLabel" @click="handleCancel" />
        <UButton :color="confirmColor" :label="confirmLabel" @click="handleConfirm" />
      </div>
    </template>
  </UModal>
</template>
