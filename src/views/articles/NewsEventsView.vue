<template>
  <ArticleListView
    title="Tin tức và sự kiện"
    :tags="['Sự kiện', 'Tin tức']"
    category-path="news-events"
  />
</template>

<script setup lang="ts">
import ArticleListView from './ArticleListView.vue'
</script>
