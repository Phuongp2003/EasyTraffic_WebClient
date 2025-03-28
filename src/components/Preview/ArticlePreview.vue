<template>
  <div>
    <div v-if="cover" class="cover-image">
      <img :src="cover" alt="Cover Image" />
    </div>
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
    <p>{{ description }}</p>
    <div v-html="content"></div>
    <div v-if="backgroundImage" class="background-image">
      <img :src="backgroundImage" alt="Background Image" />
    </div>
    <p>{{ type }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  description: string
  content: string
  cover: string
  backgroundImage: string
  type: string
}>()
</script>

<style scoped>
.cover-image img,
.background-image img {
  width: 100%;
  height: auto;
}
</style>
