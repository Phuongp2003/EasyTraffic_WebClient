<template>
  <div class="p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <UButton
            icon="i-heroicons-plus"
            label="New Article"
            color="primary"
            @click="navigateToCreate"
          />
        </div>
      </template>

      <UTable v-model:sorting="sorting" :data="articles" :columns="columns" :loading="loading">
        <template #actions-data="{ row }">
          <UDropdownMenu :items="getRowItems(row)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" />
          </UDropdownMenu>
        </template>
      </UTable>

      <template #footer>
        <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-gray-500">
            Hiển thị {{ articles.length }} / {{ totalItems }} bài viết
          </div>
          <UPagination
            v-model="currentPage"
            :total="totalItems"
            :page-count="totalPages"
            :per-page="itemsPerPage"
            @update:model-value="onPageChange"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, h, resolveComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles, type Article } from '@/composables/useArticles'
import type { TableColumn } from '@nuxt/ui'
import type { Row, Column } from '@tanstack/vue-table'
import LazyConfirmDialog from '@/components/ConfirmDialog.vue'
const props = defineProps<{
  title: string
  tags: string[]
  categoryPath: string
}>()

const router = useRouter()
const {
  articles,
  loading,
  fetchArticles,
  deleteArticle,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  goToPage
} = useArticles()

const toast = useToast()
const sorting = ref([{ id: 'title', desc: false }])

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UPagination = resolveComponent('UPagination')

function getRowItems(row: Row<Article>) {
  return [
    {
      label: `Sửa bài viết`,
      icon: 'i-heroicons-pencil-square',
      to: `/articles/${props.categoryPath}/edit/${row.original.slug}`,
    },
    {
      label: 'Sao chép ID',
      icon: 'i-heroicons-document-duplicate',
      onSelect: () => {
        navigator.clipboard.writeText(row.original.id)
        toast.add({
          title: 'ID bài viết đã được sao chép vào clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      label: 'Sửa thành phần liên kết',
      icon: 'i-heroicons-pencil',
      onSelect: () => navigateToRelatedEntity(row.original),
    },
    {
      type: 'separator',
    },
    {
      label: 'Xoá bài viết',
      icon: 'i-heroicons-trash',
      color: 'error',
      onSelect: () => confirmDelete(row.original),
    },
  ]
}

const columns: TableColumn<Article>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => getHeader(column, 'Tiêu đề'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Thời gian tạo'),
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('vi-VN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    },
  },
  {
    accessorKey: 'viewCount',
    header: ({ column }) => getHeader(column, 'Lượt xem'),
    cell: ({ row }) => row.getValue('viewCount'),
  },
  {
    accessorKey: 'relatedInfo',
    header: ({ column }) => getHeader(column, 'Thông tin liên kết'),
    cell: ({ row }) => {
      const article = row.original
      if (article.Advisor) {
        return `Leader: ${article.Advisor.fullName}`
      } else if (article.School) {
        return `Trường: ${article.School.name}`
      } else if (article.VisaType) {
        return `Visa: ${article.VisaType.name}`
      }
      return 'Chưa có liên kết'
    },
  },
  {
    accessorKey: 'subTags',
    header: ({ column }) => getHeader(column, 'Thẻ'),
    cell: ({ row }) => row.original.tags.subTags?.join(', '),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            }),
        ),
      )
    },
  },
]

function getHeader(column: Column<Article>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start',
      },
      items: [
        {
          label: 'Tăng',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          },
        },
        {
          label: 'Giảm',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-(--ui-bg-elevated)',
      }),
  )
}

const navigateToCreate = () => {
  router.push(`/articles/${props.categoryPath}/create`)
}

const overlay = useOverlay()
const confirmDelete = async (article: Article) => {
  const modal = overlay.create(LazyConfirmDialog)
  await modal.open({
    title: 'Xác nhận xoá',
    message: `Bạn có chắc chắn muốn xoá bài viết "${article.title}"?`,
    confirmLabel: 'Xoá',
    cancelLabel: 'Huỷ',
    async onConfirm() {
      try {
        await deleteArticle(article.slug)
        toast.add({
          title: 'Thành công',
          description: 'Bài viết đã được xoá thành công',
        })
        // Refresh with current pagination
        fetchArticles(props.tags, currentPage.value, itemsPerPage.value)
        modal.close()
      } catch {
        toast.add({
          title: 'Lỗi',
          description: 'Xoá thất bại',
          color: 'error',
        })
      }
    },
    onCancel() {
      modal.close()
    },
  })
}

const navigateToRelatedEntity = (article: Article) => {
  if (article.Advisor) {
    router.push(`/leaders/edit/${article.Advisor.id}`)
  } else if (article.School) {
    router.push(`/school/edit/${article.School.id}`)
  } else if (article.VisaType) {
    router.push(`/visa/edit/${article.VisaType.id}`)
  }
}

const onPageChange = (page: number) => {
  if (page !== currentPage.value) {
    goToPage(page)
    fetchArticles(props.tags, page, itemsPerPage.value)
  }
}

// Watch for sorting changes to refetch with current pagination
watch(sorting, () => {
  fetchArticles(props.tags, currentPage.value, itemsPerPage.value)
})

onMounted(() => {
  fetchArticles(props.tags, 1, itemsPerPage.value)
})
</script>
