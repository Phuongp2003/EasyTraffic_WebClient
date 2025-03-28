<template>
  <div
    class="inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full align-middle"
  >
    <UAvatar
      :src="avatarUrl"
      :alt="userName"
      fallback-src="/default-avatar.png"
      size="sm"
      class="size-8"
    />
  </div>
</template>

<script setup lang="ts">
const userName = 'User'
const avatarUrl = 'https://ui.shadcn.com/avatars/01.png'
</script>

<style scoped>
:deep(img) {
  width: 32px;
  height: 32px;
  object-fit: cover;
}
</style>
