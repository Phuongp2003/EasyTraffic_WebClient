<template>
  <UModal v-model:show="show" title="Create Related Entity">
    <template #body>
      <p>Bạn có muốn tạo đơn vị tương ứng với bài viết?</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Không" @click="onCancel" />
        <UButton color="primary" label="Có" @click="onConfirm" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  articleType: string
  onConfirm: () => void
  onCancel: () => void
}>()

const show = ref(true)
</script>
